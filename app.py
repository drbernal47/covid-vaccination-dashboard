# import functions from flask
from flask import Flask
from flask import render_template
from flask import jsonify

# import functions from SQL Alchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from config import username, password

# define the database connection parameters
database_name = 'covid_db'
connection_string = f'postgresql://{username}:{password}@localhost:5432/{database_name'

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
    results = session.query(table.col1, tables.col2, etc).all()
    session.close()

    vaccine_list = []
    for col1, col2, etc in results:
        dict {}
        dict["col1"] = col1
        dict["col2"] = col2
        dict["etc"] = etc
        vaccine_list.append(dict)

    return jsonify(vaccine_list)


if __name__ == '__main__':
    app.run(debug=True)