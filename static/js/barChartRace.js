console.log('barChartRace.js loaded');

var sampleData = [
    {date: Date.parse('2000-01-01'),
    name: 'Coca-Cola',
    category: 'Beverages',
    value: 72537},
    {date: Date.parse('2000-01-01'),
    name: 'Pepsi',
    category: 'Beverages',
    value: 63723},
    {date: Date.parse('2000-01-01'),
    name: 'McDonalds',
    category: 'Food',
    value: 372923},
    {date: Date.parse('2001-01-01'),
    name: 'Coca-Cola',
    category: 'Beverages',
    value: 42384},
    {date: Date.parse('2001-01-01'),
    name: 'Pepsi',
    category: 'Beverages',
    value: 24784},
    {date: Date.parse('2001-01-01'),
    name: 'McDonalds',
    category: 'Food',
    value: 198363},
    {date: Date.parse('2002-01-01'),
    name: 'Coca-Cola',
    category: 'Beverages',
    value: 10292},
    {date: Date.parse('2002-01-01'),
    name: 'Pepsi',
    category: 'Beverages',
    value: 8273},
    {date: Date.parse('2002-01-01'),
    name: 'McDonalds',
    category: 'Food',
    value: 12934},
];

console.log(sampleData);


// // Chart
// chart = {
//     replay;
  
//     const svg = d3.create("svg")
//         .attr("viewBox", [0, 0, width, height]);
  
//     const updateBars = bars(svg);
//     const updateAxis = axis(svg);
//     const updateLabels = labels(svg);
//     const updateTicker = ticker(svg);
  
//     yield svg.node();
  
//     for (const keyframe of keyframes) {
//       const transition = svg.transition()
//           .duration(duration)
//           .ease(d3.easeLinear);
  
//       Extract the top bar’s value.
//       x.domain([0, keyframe[1][0].value]);
  
//       updateAxis(keyframe, transition);
//       updateBars(keyframe, transition);
//       updateLabels(keyframe, transition);
//       updateTicker(keyframe, transition);
  
//       invalidation.then(() => svg.interrupt());
//       await transition.end();
//     }
//   };

// Generate names for each bar based on data
var names = new Set(sampleData.map(d => d.name))
console.log(names);

// Generate date values based on data
datevalues = Array.from(d3.rollup(sampleData, ([d]) => d.value, d => +d.date, d => d.name))
  .map(([date, sampleData]) => [new Date(date), sampleData])
  .sort(([a], [b]) => d3.ascending(a, b))
console.log(datevalues);


// Function that ranks the values
function rank(value) {
    const data = Array.from(names, name => ({name, value: value(name)}));
    data.sort((a, b) => d3.descending(a.value, b.value));
    for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
    return data;
  }

// d3 = require("d3@6");