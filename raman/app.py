# import Flask
import numpy as np

# import pandas
import pandas as pd

#import flask
from flask import Flask, jsonify

# import SQLAlchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func


import pymysql
pymysql.install_as_MySQLdb()


#################################################
# Database Setup
#################################################
engine = create_engine("mysql://root:password@localhost:3306/project_3")
conn = engine.connect()
# Query All Records in the the Database
data = pd.read_sql("SELECT * FROM airbnb", conn)
# save dataframe as a list of dictionaries for easy translation to JSON
list = data.T.to_dict()


#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################
@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/current-listings<br/>"
        f"/api/v1.0/neighborhood-data"
    )


@app.route("/api/v1.0/current-listings")
def currentlistings():
    """Return a list of all airbnb listings"""
    return jsonify(list)


@app.route("/api/v1.0/neighborhood-data")
def neighborhood():
    """Return a list of posting data grouped by neighborhood"""
    # print(results[0])
    # To do
    # return unique host_neighborhoods into a list
    # average specified numeric fields by each neighborhood
    # save key and averaged value into dictionary for each neighborhood

    #PLACEHOLDER SCRIPT
    neighborhoods = []
    
    for item in list:
        neighborhoods.append(item)
    return jsonify(neighborhoods)


if __name__ == '__main__':
    app.run(debug=True)