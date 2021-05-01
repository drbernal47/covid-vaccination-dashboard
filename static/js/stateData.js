console.log('stateData.js');


// Function that retrieves all state vaccine data (from JSON – later change to flask route)
function getActuals() {
    var url = `https://api.covidactnow.org/v2/states.timeseries.json?apiKey=${api_key}`;

    d3.json(url).then(function(response) {
        console.log(response);

        var states = [];
        for (i=0; i < response.length; i++) {
            var stateData = response[i];
            var stateID = stateData.state;
            
            if (stateID != 'MP') {
                if (stateID != 'PR') {
                    var stateActuals = stateData.actualsTimeseries;
                    console.log(stateActuals);
                }
            }
            var dict = {};
            dict[stateID] = stateActuals;
            states.push(dict);
        // Want to return a dictionary with keys as the state ID and the stateActuals as the value
        console.log(states);
        }
    });
}

getActuals();



// Initial map of the United States with choropleth of vaccine data


    // United States (plus DC) geojson



// Event handler for clicks on states






// Initial line graphs (of all states + DC data)