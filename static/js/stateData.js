console.log('stateData.js');


// Function that retrieves all state vaccine data (from JSON – later change to flask route)
var url = `https://api.covidactnow.org/v2/states.timeseries.json?apiKey=${json_api_key}`;

d3.json(url).then(function(response) {
  console.log(response);

  // object to hold state vaccination ratios
  var states = {};
  for (i=0; i < response.length; i++) {
    var stateData = response[i];
    var stateID = stateData.state;
    var metrics = stateData.metrics;
    var vcr = metrics.vaccinationsCompletedRatio;
    
    if (stateID != 'MP') {
      if (stateID != 'PR') {
        var stateName = toStateName(stateID);
        states[stateName] = vcr;     
        
      }
    }
  }
console.log(states);
  
createMap(states); 
});
      

// Initial map of the United States with choropleth of vaccine data
// Creating map object
function createMap(states) {
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

  // Grab data with d3
  d3.json(geoData).then(function(data) {

    for (i=0; i < 52; i++) {
      // Find the properties section of each state
      if (data.features[i].properties.NAME !== "Puerto Rico"){
          var stateProperties = data.features[i].properties;
        }
          
        //console.log(stateProperties);

        // retrieve vaccine complete ratio and add it to properties for each stat
        Object.keys(states).forEach(key => {
          if (stateProperties.NAME === key) {
            stateProperties['VACCINESCOMPLETERATIO'] = states[key];
          }
        })
      console.log(stateProperties);
    }

      // Create a new choropleth layer
      geojson = L.choropleth(data, {
    
        // Define what  property in the features to use
        valueProperty: "VACCINESCOMPLETERATIO",
    
        // Set color scale
        scale: ["#FF6347", "#7CFC00"],
    
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
    
        // Binding a pop-up to each layer
        onEachFeature: function(feature, layer) {
          layer.bindPopup("State: " + feature.properties.NAME + "<br>Vaccinations Completed:<br>" +
             + feature.properties.VACCINESCOMPLETERATIO);
        }
      }).addTo(myMap);
    

      // // Set up the legend
      var legend = L.control({ position: "bottomleft" });
      legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = geojson.options.limits;
        var colors = geojson.options.colors;
        var labels = [];
    
        // Add min & max
        var legendInfo = "<h1>Vaccinations Completed Ratio</h1>" +
          "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
          "</div>";
    
        div.innerHTML = legendInfo;
    
        limits.forEach(function(limit, index) {
          labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });
    
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
      };
    
      // Adding legend to the map
      legend.addTo(myMap);
    
  });

};