from flask import(   
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import os

import pymysql
pymysql.install_as_MySQLdb()

import sqlite3

#create an engine and connect to mysql database
# engine = create_engine("mysql://root:juNEtwentyONE7512475@localhost/fast_food", echo = True)
engine = create_engine("sqlite:///project.db")
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

fastfood = Base.classes.fastfood
obesity = Base.classes.obesity
poverty = Base.classes.poverty
population = Base.classes.population

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
app =  Flask(__name__)
#################################################
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/data/<sample>")
def byState(sample):
    results = session.query(Base.classes[sample].state, Base.classes[sample].rate).all()
    return jsonify(results)

# @app.route("/obesity")
# def obesity():
#     results = session.query(ObesityTable.state, ObesityTable.rate).all()
#     data = []
#     for r in results: 
#         data_dict = {}
#         data_dict["state"]= r.state
#         data_dict["adult_rate"]= str(r.adultObesityRate)
#         data.append(data_dict)
#     return jsonify(data)

# @app.route("/poverty")
# def poverty():
#     results = session.query(PovertyTable.state, PovertyTable.povertyRate).all()
#     data = []
#     for r in results: 
#         data_dict = {}
#         data_dict["state"]= r.state
#         data_dict["rate"]=str(r.povertyRate)
#         data.append(data_dict)
#     return jsonify(data)

# @app.route("/ffdata")
# def data():
#     results = session.query(FastFoodTable).all()
#     data = []
#     for r in results:
#         data_dict = {}
#         data_dict["latitude"] = str(r.latitude)
#         data_dict["longitude"] = str(r.longitude)
#         data_dict["name"] = r.name
#         data.append(data_dict)
#     return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)