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
  
  
  document.getElementById('sort').addEventListener('click', () => {

    data.sort((a, b) => b.pts - a.pts);
  
    y.domain(data.map(d => d.player));
  
    svg.selectAll(".bar")
        .transition()
        .duration(1000)
        .attr("y", d => y(d.player));
  });
  