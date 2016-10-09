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
    resp['country'] = country
    resp['country_code'] = country_code
    return json.jsonify(resp)


if __name__ == '__main__':
    app.run(host='0.0.0.0')
