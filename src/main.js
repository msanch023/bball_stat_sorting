const margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Declare 'y' and 'data' outside to make them accessible in 'sortAndUpdate'
let y = d3.scaleBand().range([0, height]).padding(.1);
let data;

d3.csv("top10.csv").then(function(loadedData) {
  data = loadedData; // Assign the loaded data to 'data'
  data.forEach(d => {
    d.pts = +d.pts;
    d.ast = +d.ast;
    d.reb = +d.trb;
  });

  const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.reb)])
      .range([0, width]);
      svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .attr("class", "x-axis") // Add this line to give your x-axis <g> element a class
      .call(d3.axisBottom(x));

  y.domain(data.map(d => d.player));

  svg.append("g").call(d3.axisLeft(y));

  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0))
    .attr("y", d => y(d.player))
    .attr("width", d => x(d.pts))
    .attr("height", y.bandwidth())
    .attr("class", "bar");
});

document.getElementById('sort-points').addEventListener('click', () => {
  sortAndUpdate("pts");
});

document.getElementById('sort-assists').addEventListener('click', () => {
  sortAndUpdate("ast");
});

document.getElementById('sort-rebounds').addEventListener('click', () => {
  sortAndUpdate("reb");
});

function sortAndUpdate(stat) {
  console.log(`Sorting by ${stat}`);

  // Sort data
  data.sort((a, b) => b[stat] - a[stat]);
  
  // Update y-domain based on sorted data
  y.domain(data.map(d => d.player));
  
  // Recalculate x-scale based on new stat's max value
  const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[stat])])
      .range([0, width]);
  
  // Update x-axis
  svg.select(".x-axis")
    .transition()
    .duration(1000)
    .call(d3.axisBottom(x)); // Make sure this selects and updates the x-axis correctly

  // Transition bars
  svg.selectAll(".bar")
    .data(data)
    .transition()
    .duration(1000)
    .attr("x", x(0))
    .attr("y", d => y(d.player))
    .attr("width", d => {
        const widthValue = x(d[stat]);
        if (isNaN(widthValue)) {
            console.error(`Invalid width for player ${d.player} with stat ${stat}:`, d[stat]);
        }
        return widthValue;
    }) // Make sure the width calculation is correct
    .attr("height", y.bandwidth());
}

