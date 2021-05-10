console.log('stateData.js');


// Function that retrieves all state vaccine data (from JSON – later change to flask route)
var url = `https://api.covidactnow.org/v2/states.timeseries.json?apiKey=${json_api_key}`;

d3.json('/vaccinations').then(response => {
  // console.log(response);

  // Object to hold state vaccination ratios
  var states = [];
  for (i=0; i < response.length; i++){
    var respDate = Date.parse(response[i]['date']);
    if (respDate === Date.parse('2021-05-03')){
      // console.log(response[i]);
      var stateData = response[i];

      if (stateData.state != 'PR'){
        if (stateData.state != 'MP'){
          states.push(stateData);
        }
      }
    }
  }
  console.log(states);

  createMap(states);
});

createLineGraph();


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
      if (data.features[i].properties.NAME != "Puerto Rico"){
          var stateProperties = data.features[i].properties;
        }
          
        //console.log(stateProperties);

        // retrieve vaccine complete ratio and add it to properties for each stat
        states.forEach(s => {
          if (stateProperties.NAME === toStateName(s.state)){
            stateProperties['VACCINESCOMPLETERATIO'] = s.vaccinations_completed_ratio;
          }
        })


      // console.log(stateProperties);
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
          fillOpacity: 0.5
        },
    
        // Binding a pop-up to each layer
        onEachFeature: function(feature, layer) {
          var ratio = feature.properties.VACCINESCOMPLETERATIO;
          var percent = toPercent(ratio);
          var stateName = feature.properties.NAME;

          layer.on({
            mouseover: function(event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.9
              });
            },
            mouseout: function(event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.5
              });
            },

            click: function(event) {
              // myMap.fitBounds(event.target.getBounds());
              redrawLineGraph(stateName);
            }

          });

          layer.bindPopup("State: " + stateName + "<br>Vaccinations Completed:<br>" +
             + percent + "%");
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
        var legendInfo = "<h1>Vaccinations Completed (% of Pop.)</h1>" +
          "<div class=\"labels\">" +
            "<div class=\"min\">" + toPercent(limits[0]) + "%</div>" +
            "<div class=\"max\">" + toPercent(limits[limits.length - 1]) + "%</div>" +
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


function redrawLineGraph(stateName) {
  console.log(`redrawLinGraph ${stateName}`);

  d3.json("/vaccinations").then(function(data) {
    console.log(data);


    var vaccinesInitiated = [];
    var vaccinesCompleted = [];
    var dates = [];

    for (var i = 0; i < data.length; i ++) {
      var stateID = data[i].state;
      data[i].state = toStateName(stateID);

      if (data[i].state === stateName && data[i].vaccines_initiated !== null) {
      
        vaccinesInitiated.push(data[i].vaccines_initiated);
        vaccinesCompleted.push(data[i].vaccines_completed);
        dates.push(data[i].date);
      }

    }
    
    console.log(vaccinesInitiated);
    console.log(vaccinesCompleted);
    console.log(dates);

  var traceInitiated = {
    x: dates,
    y: vaccinesInitiated,
    type: 'scatter',
    name: 'Initiated'
  }

  var traceCompleted = {
    x: dates,
    y: vaccinesCompleted,
    type: 'scatter',
    name: 'Completed'
  }

  // Create data
  var data = [traceInitiated, traceCompleted];

  // Create layout
  var layout = {
    title: `Vaccines for ${stateName}`,
    xaxis: {title: "Date"},
    yaxis: {title: "Vaccine Counts"}
  }

  // Combine into Plotly
  Plotly.newPlot('line-graph',data, layout);
});
}


function createLineGraph() {
  
  // console.log("createLineGraph");

  d3.json("/vaccinations").then(function(data) {
    // console.log(data);


    
    var dates = [];

    for (var i = 0; i < data.length; i ++) {
      var stateID = data[i].state;
      data[i].state = toStateName(stateID);


      if (data[i].state === "Alaska" && data[i].vaccines_initiated !== null) {

        dates.push(data[i].date);
      }

    }
      // console.log(dates);
    

    var vaccinesInitiated = [];
    var vaccinesCompleted = [];
      
    for (var i = 0; i < dates.length; i ++) {
        
      var dailyTotalInitiated = 0;
      var dailyTotalCompleted = 0;

      
      for (var j = 0; j < data.length; j ++) {

        if ( data[j].vaccines_initiated !== null) {

          if (data[j].date === dates[i]) {
            var dailyInit = data[j].vaccines_initiated;
            var dailyComp = data[j].vaccines_completed;

            
            dailyTotalInitiated += dailyInit;
            dailyTotalCompleted += dailyComp;
          }
        }
      } 

      
      vaccinesInitiated.push(dailyTotalInitiated);
      vaccinesCompleted.push(dailyTotalCompleted);
      
    }
        
      
    
    // console.log(vaccinesInitiated);
    // console.log(vaccinesCompleted);

  



  var traceInitiated = {
    x: dates,
    y: vaccinesInitiated,
    type: 'scatter',
    name: 'Initiated'
      
  }

  var traceCompleted = {
    x: dates,
    y: vaccinesCompleted,
    type: 'scatter',
    name: 'Completed'
  }


  // Create data
  var data = [traceInitiated, traceCompleted];


  // Create layout
  var layout = {
    title: `Vaccines for the U.S.`,
    xaxis: {title: "Date"},
    yaxis: {title: "Vaccine Counts"}
  }


  // Combine into Plotly
  Plotly.newPlot('line-graph',data,layout);
 });
}
