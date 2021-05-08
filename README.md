# Covid-Vaccination-Dashboard
This project tells a story about Covid-19 vaccines through data visualizations. We used API Data from https://covidactnow.org/data-api and created a dashboard using a Flask server, Leaflet Map, a Plotly Chart, and a Bar Chart Race. 

The following dashboard analyzes Covid-19 vaccinations in the United States. Each state has been analyzed so that the three visualizations illustrate the percentage of population vaccinated, number of people vaccinated in the United States and per state, and number of Covid-19 cases per state. Each visualization analyzes 111 days worth of vaccine data from January 14, 2021 to May 3, 2021.

# Directions

1. Clone the repo to your desktop.
1. Open the repo in Visual Studio Code. 
1. Create a file called config.js in the "js" folder.
1. Go to https://www.mapbox.com/ and create a map API key.
1. In the config.js file, type "map_api_key" = "*YOUR MAP API KEY*";
1. Save the config.js file.
1. Create a file called config.py outside of all the folders.
1. In the config.py file, type "username = '*YOUR PGADMIN USERNAME HERE*'"
1. In the config.py file, type "password = '*YOUR PGADMIN PASSWORD HERE*'"
1. Save the config.py file.
1. Open a git bash (Windows) or terminal (Mac) at the covid-vaccination-dashboard folder.
1. Type `<source activate PythonData>` and then hit ENTER.
1. Type `<jupyter notebook>` and then hit ENTER.
1. Open pgAdmin and enter your credentials.
1. Create a database called "vaccineData_db".
1. Open a query tool at the "vaccineData_db" database.
1. Click open file and navigate to the 'vaccineData_db.sql' file in the covid-vaccine-dashboard folder.
1. Run the create table SQL commands for the 'vaccineData' table. 
1. Open the Jupyter Notebook, and open the "Vaccine_ETL.ipynb" file. 
1. Run all of the code.
1. Back in the git bash or terminal type `<python app.py>` and then hit ENTER. 
1. Observe that the Flask server starts and tells you which port it's running on. Don't close this window.
1. With the Flask server running, enter this address in your Chrome browser:  http://127.0.0.1:5000. This will load the index page. 
1. If you navigate to the following address, you'll see that it returns a JSON: http://127.0.0.1:5000/vaccinations. This is an example of an API endpoint you'd use to get data into your JavaScript file for graphing and analysis.
