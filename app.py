# import functions from flask
from flask import Flask
from flask import render_template
from flask import jsonify

# import functions from SQL Alchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from config import username, password

# define the database connection parameters
database_name = 'vaccineData_db'
connection_string = f'postgresql://{username}:{password}@localhost:5432/{database_name}'

# connect to the database
engine = create_engine(connection_string)
base = automap_base()
base.prepare(engine, reflect=True)

# choose the table we wish to use
table = base.classes.vaccinations

# instantiate the Flask application
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.route("/")
def IndexRoute():

    webpage = render_template("index.html")
    return webpage

@app.route("/vaccinations")
def QueryCovidDataBase():

    # open a session, run the query, and then close the session
    session = Session(engine)
    results = session.query(table.id, table.date, table.country, table.state, table.cases, table.new_cases, table.vaccines_distributed, table.vaccines_initiated, table.vaccines_completed, table.infection_rate).all()
    session.close()

    vaccine_list = []

    for id, date, country, state, cases, new_cases, vaccines_distributed, vaccines_initiated, vaccines_completed, infection_rate in results:
        dict = {}
        dict["id"] = id
        dict["date"] = date
        dict["country"] = country
        dict["state"] = state
        dict["cases"] = cases
        dict["new_cases"] = new_cases
        dict["vaccines_distributed"] = vaccines_distributed
        dict["vaccines_initiated"] = vaccines_initiated
        dict["vaccines_completed"] = vaccines_completed
        dict["infection_rate"] = infection_rate
        vaccine_list.append(dict)

    return jsonify(vaccine_list)


if __name__ == '__main__':
    app.run(debug=True)