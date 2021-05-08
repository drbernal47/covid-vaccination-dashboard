console.log('barChartRace.js loaded');

var sampleData = [
  {
    date: Date.parse('2000-01-01'),
    name: 'Coca-Cola',
    category: 'Beverages',
    value: 72537
  },
  {
    date: Date.parse('2000-01-01'),
    name: 'Pepsi',
    category: 'Beverages',
    value: 63723
  },
  {
    date: Date.parse('2000-01-01'),
    name: 'McDonalds',
    category: 'Food',
    value: 372923
  },
  {
    date: Date.parse('2001-01-01'),
    name: 'Coca-Cola',
    category: 'Beverages',
    value: 42384
  },
  {
    date: Date.parse('2001-01-01'),
    name: 'Pepsi',
    category: 'Beverages',
    value: 24784
  },
  {
    date: Date.parse('2001-01-01'),
    name: 'McDonalds',
    category: 'Food',
    value: 198363
  },
  {
    date: Date.parse('2002-01-01'),
    name: 'Coca-Cola',
    category: 'Beverages',
    value: 10292
  },
  {
    date: Date.parse('2002-01-01'),
    name: 'Pepsi',
    category: 'Beverages',
    value: 827300
  },
  {
    date: Date.parse('2002-01-01'),
    name: 'McDonalds',
    category: 'Food',
    value: 12934
  },
];

// console.log(sampleData);

d3.json('/vaccinations').then(response =>{
  console.log(response);

  // Push only desired dates into an array
  caseData = [];

  response.forEach(item => {
    var date = Date.parse(item.date);
    if (date >= Date.parse('2021-01-14')) {
      var entry = item;
      entry['category'] = 'Decreasing';
      entry['date'] = date;
      entry['value'] = item.infection_rate;
      if (item.infection_rate >= 1) {
        entry['category'] = 'Increasing';
      }

      if (entry.state != 'PR') {
        if (entry.state != 'MP') {
          if (entry.date < Date.parse('2021-05-04')) {
            caseData.push(entry);
          }
        }
      }
    }
  });

  console.log(caseData);


  // Define SVG parameters for later
  var width = 800;
  var height = 600;
  var margin = {
    left: 25,
    right: 25,
    top: 25,
    bottom: 25
  };
  var barSize = 30;


  color = (function () {
    const scale = d3.scaleOrdinal(d3.schemeTableau10);
    if (caseData.some(d => d.category !== undefined)) {
      const categoryByName = new Map(caseData.map(d => [d.state, d.category]))
      scale.domain(Array.from(categoryByName.values()));
      return d => scale(categoryByName.get(d.state));
    }
    return d => scale(d.state);
  })();


  // Format dates for display
  var formatDate = d3.utcFormat("%b %d %Y");

  // Format the numbers on the bars
  var formatNumber = d3.format(",.3f");

  // Determine the duration of animation
  var duration = 250;

  // Determine the number of "top" bars shown in the race
  var n = 15;

  // Generate names for each bar based on data
  var names = new Set(caseData.map(d => d.state))
  // console.log(names);

  // Generate date values based on data
  datevalues = Array.from(d3.rollup(caseData, ([d]) => d.value, d => +d.date, d => d.state))
    .map(([date, caseData]) => [new Date(date), caseData])
    .sort(([a], [b]) => d3.ascending(a, b))
  console.log(datevalues);

  // Determine the amount of interpolation (frames between date values)
  var k = 5;

  keyframes = (function () {
    const keyframes = [];
    let ka, a, kb, b;
    for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
      for (let i = 0; i < k; ++i) {
        const t = i / k;
        keyframes.push([
          new Date(ka * (1 - t) + kb * t),
          rank(state => (a.get(state) || 0) * (1 - t) + (b.get(state) || 0) * t)
        ]);
      }
    }
    keyframes.push([new Date(kb), rank(state => b.get(state) || 0)]);
    return keyframes;
  })();

  console.log(keyframes);

  // Create nameframes
  var nameframes = d3.groups(keyframes.flatMap(([, data]) => data), d => d.state);
  console.log(nameframes);

  // Create prev (tells you when a state leaves the top ranks)
  var prev = new Map(nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])));
  console.log(prev);

  // Create next (tells you when a state enters the top ranks)
  var next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)));
  console.log(next);

  // Define linear scales to calculate x and y positions
  var x = d3.scaleLinear([0, 1], [margin.left, width - margin.right]);
  var y = d3.scaleBand()
    .domain(d3.range(n + 1))
    .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
    .padding(0.1);


  // Function that ranks the values
  function rank(value) {
    const data = Array.from(names, state => ({ state, value: value(state) }));
    data.sort((a, b) => d3.descending(a.value, b.value));
    for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
    return data;
  }

  // Ticker function
  function ticker(svg) {
    const now = svg.append("text")
      .style("font", `bold ${barSize}px var(--sans-serif)`)
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "end")
      .attr("x", width - 6)
      .attr("y", margin.top + barSize * (n - 0.45))
      .attr("dy", "0.32em")
      .text(formatDate(keyframes[0][0]));

    return ([date], transition) => {
      transition.end().then(() => now.text(formatDate(date)));
    };
  }

  // Axis function
  function axis(svg) {
    const g = svg.append("g")
      .attr("transform", `translate(0,${margin.top})`);

    const axis = d3.axisTop(x)
      .ticks(width / 160)
      .tickSizeOuter(0)
      .tickSizeInner(-barSize * (n + y.padding()));

    return (_, transition) => {
      g.transition(transition).call(axis);
      g.select(".tick:first-of-type text").remove();
      g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
      g.select(".domain").remove();
    };
  }

  // Function textBetween
  function textTween(a, b) {
    const i = d3.interpolateNumber(a, b);
    return function (t) {
      this.textContent = formatNumber(i(t));
    };
  }


  // Function Labels
  function labels(svg) {
    let label = svg.append("g")
      .style("font", "bold 12px var(--sans-serif)")
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "end")
      .selectAll("text");

    return ([date, data], transition) => label = label
      .data(data.slice(0, n), d => d.state)
      .join(
        enter => enter.append("text")
          .attr("transform", d => `translate(${x((prev.get(d) || d).value)},${y((prev.get(d) || d).rank)})`)
          .attr("y", y.bandwidth() / 2)
          .attr("x", -6)
          .attr("dy", "-0.25em")
          .text(d => d.state)
          .call(text => text.append("tspan")
            .attr("fill-opacity", 0.7)
            .attr("font-weight", "normal")
            .attr("x", -6)
            .attr("dy", "1.15em")),
        update => update,
        exit => exit.transition(transition).remove()
          .attr("transform", d => `translate(${x((next.get(d) || d).value)},${y((next.get(d) || d).rank)})`)
          .call(g => g.select("tspan").tween("text", d => textTween(d.value, (next.get(d) || d).value)))
      )
      .call(bar => bar.transition(transition)
        .attr("transform", d => `translate(${x(d.value)},${y(d.rank)})`)
        .call(g => g.select("tspan").tween("text", d => textTween((prev.get(d) || d).value, d.value))))
  }



  // Function to draw the bars
  function bars(svg) {
    let bar = svg.append("g")
      .attr("fill-opacity", 0.6)
      .selectAll("rect");

    return ([date, data], transition) => bar = bar
      .data(data.slice(0, n), d => d.state)
      .join(
        enter => enter.append("rect")
          .attr("fill", color)
          .attr("height", y.bandwidth())
          .attr("x", x(0))
          .attr("y", d => y((prev.get(d) || d).rank))
          .attr("width", d => x((prev.get(d) || d).value) - x(0)),
        update => update,
        exit => exit.transition(transition).remove()
          .attr("y", d => y((next.get(d) || d).rank))
          .attr("width", d => x((next.get(d) || d).value) - x(0))
      )
      .call(bar => bar.transition(transition)
        .attr("y", d => y(d.rank))
        .attr("width", d => x(d.value) - x(0)));
  }



  // Chart
  async function renderGraph(controller = {}) {
    const svg = d3.select("#bar-chart-race")
      .attr("viewBox", [0, 0, width, height]);

    svg.selectAll('*').remove();

    const updateBars = bars(svg);
    const updateAxis = axis(svg);
    const updateLabels = labels(svg);
    const updateTicker = ticker(svg);

    //maybe give us an update with svg.node()

    for (const keyframe of keyframes) {
      const transition = svg.transition()
        .duration(duration)
        .ease(d3.easeLinear);

      // Extract the top bar’s value.
      x.domain([0, keyframe[1][0].value]);

      updateAxis(keyframe, transition);
      updateBars(keyframe, transition);
      updateLabels(keyframe, transition);
      updateTicker(keyframe, transition);

      // invalidation.then(() => svg.interrupt());
      await transition.end();

      if (controller.pause) {
        await controller.resumePromise;
      }

      if (controller.kill) {
        return;
      }
    }
  };





renderGraph();










});