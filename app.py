from flask import(   
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

import pymysql
pymysql.install_as_MySQLdb()

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import os


#create an engine and connect to mysql database
engine = create_engine("mysql://root:juNEtwentyONE7512475@localhost/fast_food", echo = True)
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

Base.classes.keys()

FastFoodTable = Base.classes.fastfoodrestaurants

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
app =  Flask(__name__)
#################################################
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/city")
def city():
    results = session.query(FastFoodTable.city).all()
    return jsonify(results)

@app.route("/data")
def data():
    results = session.query(FastFoodTable).all()
    data = []
    for r in results:
        data_dict = {}
        data_dict["city"] = r.city
        data_dict["address"] = r.address
        data_dict["country"] = r.country
        data_dict["lat"] = str(r.latitude)
        data_dict["lang"] = str(r.longitude)
        data_dict["name"] = r.name
        data.append(data_dict)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)