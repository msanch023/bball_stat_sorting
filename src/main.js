const margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


d3.csv("top10.csv").then(function(data) {

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.pts)])
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");
  
    const y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(d => d.player))
        .padding(.1);
    svg.append("g")
      .call(d3.axisLeft(y))
  
    svg.selectAll("myRect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", x(0) )
      .attr("y", d => y(d.player))
      .attr("width", d => x(d.pts))
      .attr("height", y.bandwidth())
      .attr("class", "bar")
  });
  
  
// Existing D3 code to load data and create the initial bar chart

document.getElementById('sort-points').addEventListener('click', () => {
  sortAndUpdate("pts");
});

document.getElementById('sort-assists').addEventListener('click', () => {
  sortAndUpdate("ast");
});

document.getElementById('sort-rebounds').addEventListener('click', () => {
  sortAndUpdate("reb");
});

// Function to sort data and update the chart
function sortAndUpdate(stat) {
  data.sort((a, b) => +b[stat] - +a[stat]); // Sort data based on the stat (pts, ast, reb)

  // Update the y-domain based on the new data order
  y.domain(data.map(d => d.player));

  // Transition to sort bars
  svg.selectAll(".bar")
      .transition()
      .duration(1000)
      .attr("y", d => y(d.player))
      .attr("width", d => x(+d[stat])); // Update the width of bars based on new stat
}

  