console.log('testing.js loaded');

var url = `https://api.covidactnow.org/v2/states.timeseries.json?apiKey=${api_key}`;

function getActuals() {
    d3.json(url).then(function(response) {
        console.log(response);

        for (i=0; i < response.length; i++) {
            var stateData = response[i];
            var stateID = stateData.state;
            
            if (stateID != 'MP') {
                if (stateID != 'PR') {
                    console.log(stateID);
                }
            }
        }
    });
}

getActuals();