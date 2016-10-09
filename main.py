
import json
from functools import reduce

from flask import Flask, request, json, send_from_directory, redirect
from geopy import Nominatim
import psycopg2

app = Flask(__name__, static_folder='/home/responsibuyer/responsibuyer-gh-pages')
geolocator = Nominatim()

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('/home/responsibuyer/responsibuyer-gh-pages', path)

@app.route('/')
def root():
    return redirect("/static/index.html", code=302)

conn = psycopg2.connect(database='responsibuyer')

@app.route('/search')
def search():
    global conn
    resp = {}
    lat = request.args.get('lat')
    lon = request.args.get('long')
    point = lat + ", " + lon
    location = geolocator.reverse(point, language='en')
    country = location.raw['address']['country']
    country_code = location.raw['address']['country_code']
    for _ in range(0,2):
        # Try the query twice if the connection was closed (e.g. DB restarted).
        cur = conn.cursor()
        try:
            cur.execute("""
                select p.name, 
                       p.description, 
                       w.genus, 
                       w.species, 
                       w.common_name, 
                       w.conservation_status, 
                       count(*) AS total_trades 
                from wildlife_trade wt 
                inner join wildlife w on wt.wildlife_id = w.id 
                inner join product_category p on wt.product_category_id = p.id 
                where wt.country_code ilike '{}' 
                GROUP BY p.name, p.description, w.genus, w.species, w.common_name, w.conservation_status
                ORDER BY total_trades DESC;
            """.format(country_code))
        except psycopg2.OperationalError:
            conn = psycopg2.connect(database='responsibuyer')
    rows = cur.fetchall()
    products = {}
    for row in rows:
        product_name = row[0]
        if product_name not in products:
            products[product_name] = {"name": product_name, 'desc': row[1], 'animals': []}
        animal = {}
        animal['genus'] = row[2]
        animal['species'] = row[3]
        animal['common_name'] = row[4]
        animal['conservation_status'] = row[5]
        animal['trade_count'] = row[6]
        products[product_name]['animals'].append(animal)
    sorted_products = sort_products(list(products.values()))
    resp['products'] = products
    resp['country'] = country
    resp['country_code'] = country_code

    callback = request.args.get('callback')
    if callback:
        # Return JSONP
        json_data = json.dumps(resp)
        jsonp = "{}({});".format(callback, json_data)
        response = app.make_response(jsonp)
        response.mimetype = "application/javascript"
        return response
    else:
        return json.jsonify(resp)


def sort_products(products):
    for product in products:
        product['animals'].sort(key=lambda x:x['trade_count'], reverse=True)
        total_animal_count = reduce(lambda x,y:x+y, [x['trade_count'] for x in product['animals']])
        product['ranking'] = total_animal_count
    products.sort(key=lambda x:x['ranking'], reverse=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
