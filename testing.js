console.log('testing.js loaded');

var url = `https://api.covidactnow.org/v2/states.timeseries.json?apiKey=${api_key}`;

d3.json(url).then(function(response) {
    console.log(response);
});