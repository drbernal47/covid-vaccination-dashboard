console.log('stateData.js');


// Function that retrieves all state vaccine data (from JSON – later change to flask route)
function getActuals() {
    var url = `https://api.covidactnow.org/v2/states.timeseries.json?apiKey=${json_api_key}`;

    return d3.json(url).then(function(response) {
        // console.log(response);

        var states = {};
        for (i=0; i < response.length; i++) {
            var stateData = response[i];
            var stateID = stateData.state;
            
            if (stateID != 'MP') {
                if (stateID != 'PR') {
                    var stateActuals = stateData.actualsTimeseries;
                    
                    states[stateID] = stateActuals;
                }
            }

        }
        // Want to return a dictionary with keys as the state ID and the stateActuals as the value
        return states;

    });
}





// Initial map of the United States with choropleth of vaccine data
// Creating map object
var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4
  });

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: map_api_key
}).addTo(myMap);

// Load in geojson data
var geoData = "static/data/gz_2010_us_040_00_20m.json";

var geojson;

// For loop that goes into each part of the var geoData:
// Add to the properties dictionary the vaccine value that we want (vaccinationsCompletedRatio)


// Grab data with d3
d3.json(geoData).then(function(data) {

    // var actuals = getActuals();
    // console.log(actuals);

    // Remove geojson for Puerto Rico

    // Add the property: vaccinationsCompletedData
    // console.log(data);

    for (i=0; i < 52; i++) {
        // Find the properties section of each state
        var stateProperties = data.features[i].properties;

        // Get the state name and convert to state ID
        var stateID = toStateID(stateProperties['NAME']);
        console.log(stateID);

        // This code just for testing promise inside of promise
        var url = `https://api.covidactnow.org/v2/states.timeseries.json?apiKey=${json_api_key}`;
        d3.json(url).then(function(response) {
          console.log(response[0]);

          for (j=0; j < 53; j++) {
            var stateData = response[j];
            var candidateID = stateData.state;
            
            if (candidateID === stateID) {
              var stateVaccineData = 43;
              stateProperties['vaccineNumber'] = stateVaccineData;
            }
          }
        });

        // Retrieve vaccine data based on the state ID
        // var stateVaccineData = actuals[stateID];
        // console.log(stateVaccineData);

        // Add the vaccine data to the properties section for that state
        // stateProperties['vaccineNumber'] = stateVaccineData;
        // console.log(stateProperties);
    }


    // Create a new choropleth layer
    geojson = L.choropleth(data, {
  
      // Define what  property in the features to use
      valueProperty: "STATE",
  
      // Set color scale
      scale: ["#ffffb2", "#b10026"],
  
      // Number of breaks in step range
      steps: 10,
  
      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
      },
  
    //   // Binding a pop-up to each layer
    //   onEachFeature: function(feature, layer) {
    //     layer.bindPopup("Zip Code: " + feature.properties.ZIP + "<br>Median Household Income:<br>" +
    //       "$" + feature.properties.MHI2016);
    //   }
    }).addTo(myMap);
  
    // // Set up the legend
    // var legend = L.control({ position: "bottomright" });
    // legend.onAdd = function() {
    //   var div = L.DomUtil.create("div", "info legend");
    //   var limits = geojson.options.limits;
    //   var colors = geojson.options.colors;
    //   var labels = [];
  
    //   // Add min & max
    //   var legendInfo = "<h1>Median Income</h1>" +
    //     "<div class=\"labels\">" +
    //       "<div class=\"min\">" + limits[0] + "</div>" +
    //       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    //     "</div>";
  
    //   div.innerHTML = legendInfo;
  
    //   limits.forEach(function(limit, index) {
    //     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    //   });
  
    //   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    //   return div;
    // };
  
    // // Adding legend to the map
    // legend.addTo(myMap);
  
  });
  



// Event handler for clicks on states






// Initial line graphs (of all states + DC data)