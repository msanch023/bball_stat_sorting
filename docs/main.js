
  
  
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
  