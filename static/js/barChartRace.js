console.log('barChartRace.js loaded');

var sampleData = [
    {date: '2000-01-01',
    name: 'Coca-Cola',
    category: 'Beverages',
    value: 72537},
    {date: '2000-01-01',
    name: 'Pepsi',
    category: 'Beverages',
    value: 63723},
    {date: '2000-01-01',
    name: 'McDonalds',
    category: 'Food',
    value: 372923},
    {date: '2001-01-01',
    name: 'Coca-Cola',
    category: 'Beverages',
    value: 42384},
    {date: '2001-01-01',
    name: 'Pepsi',
    category: 'Beverages',
    value: 24784},
    {date: '2001-01-01',
    name: 'McDonalds',
    category: 'Food',
    value: 198363},
    {date: '2002-01-01',
    name: 'Coca-Cola',
    category: 'Beverages',
    value: 10292},
    {date: '2002-01-01',
    name: 'Pepsi',
    category: 'Beverages',
    value: 8273},
    {date: '2002-01-01',
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

d3.group(sampleData, d => d.name);

d3 = require("d3@6");