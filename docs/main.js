d3.csv("top10.csv").then(function(data) {

    // X axis: scale and draw:
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.pts)])
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");
  
    // Y axis: scale and draw:
    const y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(d => d.player))
        .padding(.1);
    svg.append("g")
      .call(d3.axisLeft(y))
  
    //Bars
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
  
 //Button
  document.getElementById('sort').addEventListener('click', () => {
    // Sort the data by points
    data.sort((a, b) => b.pts - a.pts);
  
    // Update the Y axis domain with new order
    y.domain(data.map(d => d.player));
  
    // Transition to new order
    svg.selectAll(".bar")
        .transition()
        .duration(1000)
        .attr("y", d => y(d.player));
  });
  