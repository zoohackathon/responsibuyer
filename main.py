from flask import Flask, request, json
from geopy import Nominatim
import psycopg2

app = Flask(__name__)
geolocator = Nominatim()

conn = psycopg2.connect(database='responsibuyer')

@app.route('/search')
def search():
    resp = {}
    lat = request.args.get('lat')
    lon = request.args.get('long')
    point = lat + ", " + lon
    location = geolocator.reverse(point, language='en')
    country = location.raw['address']['country']
    country_code = location.raw['address']['country_code']
    cur = conn.cursor()
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
        where wt.country_code = 'LA' 
        GROUP BY p.name, p.description, w.genus, w.species, w.common_name, w.conservation_status
        ORDER BY total_trades DESC;
    """)
    products = []
    rows = cur.fetchall()
    for row in rows:
        product = {}
        product['name'] = row[0]
        product['desc'] = row[1]
        product['animal_genus'] = row[2]
        product['animal_species'] = row[3]
        product['animal_name'] = row[4]
        product['animal_conservation_status'] = row[5]
        product['ranking'] = row[6]
        products.append(product)
    resp['products'] = products
    resp['country'] = country
    resp['country_code'] = country_code
    return json.jsonify(resp)


if __name__ == '__main__':
    app.run(host='0.0.0.0')