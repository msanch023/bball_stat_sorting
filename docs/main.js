const margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

let x = d3.scaleBand().range([0, width]).padding(0.1);
let y = d3.scaleLinear().range([height, 0]);

const margin2 = {top: 70, right: 30, bottom: 100, left: 90},
   width2 = 800 - margin2.left - margin2.right,
  height2 = 400 - margin2.top - margin2.bottom;

const svg2 = d3.select("#chart2")
  .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform", `translate(${margin2.left},${margin2.top})`);

let x2 = d3.scaleBand().range([0, width2]).padding(0.1);
let y2 = d3.scaleLinear().range([height2, 0]);

const margin3 = {top: 70, right: 30, bottom: 100, left: 90},
    width3 = 800 - margin3.left - margin3.right,
    height3 = 400 - margin3.top - margin3.bottom;

const svg3 = d3.select("#chart3")
  .append("svg")
    .attr("width", width3 + margin3.left + margin3.right)
    .attr("height", height3 + margin3.top + margin3.bottom)
  .append("g")
    .attr("transform", `translate(${margin3.left},${margin3.top})`);

let x3 = d3.scaleBand().range([0, width3]).padding(0.1);
let y3 = d3.scaleLinear().range([height3, 0]);

let data;

d3.csv("top_100.csv").then(function(loadedData) {
  data = loadedData;
  data.forEach(d => {
    d.pts = +d.pts;
    d.ast = +d.ast;
    d.reb = +d.reb; 
  });

  x.domain(data.map(d => d.player));
  y.domain([0, d3.max(data, d => d.pts) + 200]);

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .attr("class", "x-axis")
    .selectAll("text")
    .style("display", "none"); // Hide the x-axis labels

  svg.append("g")
    .call(d3.axisLeft(y))
    .attr("class", "y-axis") // Assign a class to the y-axis for easy selection
    .selectAll("text")
    .style("display", "none"); // Hide the y-axis labels

  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.player))
    .attr("y", d => y(d.pts))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.pts))
    .attr("class", "bar");
});

document.getElementById('sort-points').addEventListener('click', () => {
  const sortMethod = document.getElementById('sort-method').value;
  sortAndUpdate("pts", sortMethod);
});

document.getElementById('sort-assists').addEventListener('click', () => {
  const sortMethod = document.getElementById('sort-method').value;
  sortAndUpdate("ast", sortMethod);
});

document.getElementById('sort-rebounds').addEventListener('click', () => {
  const sortMethod = document.getElementById('sort-method').value;
  sortAndUpdate("reb", sortMethod);
});

function sortAndUpdate(stat, sortMethod) {
  y.domain([0, d3.max(data, d => d.stat) + 200]);
  switch (sortMethod) {
    case "bubble":
      bubbleSortAndUpdate(stat);
      break;
    case "insertion":
      insertionSortAndUpdate(stat);
      break;
    case "merge":
      mergeSortAndUpdate(stat);
      break;
    default:
      console.error(`Unknown sort method: ${sortMethod}`);
  }
}


async function bubbleSortAndUpdate(stat) {
  console.log(`Bubble sorting by ${stat}`);

  let n = data.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (data[j][stat] < data[j + 1][stat]) {
        let temp = data[j];
        data[j] = data[j + 1];
        data[j + 1] = temp;
        await delay(10);
        updateChart(stat);
      }
    }
  }
}

async function insertionSortAndUpdate(stat) {
  console.log(`Insertion sorting by ${stat}`);

  let n = data.length;
  for (let i = 1; i < n; i++) {
    let key = data[i];
    let j = i - 1;
    while (j >= 0 && data[j][stat] < key[stat]) {
      data[j + 1] = data[j];
      j = j - 1;
      await delay(10);
      updateChart(stat);
    }
    data[j + 1] = key;
  }
}

async function mergeSortAndUpdate(stat) {
  console.log(`Merge sorting by ${stat}`);
  await mergeSort(data, stat);
  updateChart(stat);
}

async function mergeSort(arr, stat, l = 0, r = arr.length - 1) {
  if (l >= r) {
    return;
  }
  const m = l + Math.floor((r - l) / 2);
  await mergeSort(arr, stat, l, m);
  await mergeSort(arr, stat, m + 1, r);
  await merge(arr, stat, l, m, r);
}

async function merge(arr, stat, l, m, r) {
  const n1 = m - l + 1;
  const n2 = r - m;
  const L = new Array(n1);
  const R = new Array(n2);

  for (let i = 0; i < n1; i++) {
    L[i] = arr[l + i];
  }
  for (let j = 0; j < n2; j++) {
    R[j] = arr[m + 1 + j];
  }

  let i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    if (L[i][stat] >= R[j][stat]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    k++;
    await delay(10);
    updateChart(stat);
  }

  while (i < n1) {
    arr[k] = L[i];
    i++;
    k++;
    await delay(10);
    updateChart(stat);
  }

  while (j < n2) {
    arr[k] = R[j];
    j++;
    k++;
    await delay(10);
    updateChart(stat);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function updateChart(stat) {
  x.domain(data.map(d => d.player));
  y.domain([0, d3.max(data, d => d[stat] + 200)]);

  svg.selectAll(".x-axis text").style("display", "none");
  svg.selectAll(".y-axis").remove();
  let bars = svg.selectAll(".bar").data(data);

  svg.append("g")
    .call(d3.axisLeft(y))
    .attr("class", "y-axis");
  
  bars.enter()
    .append("rect")
    .merge(bars)
    .attr("x", d => x(d.player))
    .attr("y", d => y(d[stat]))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d[stat]))
    .attr("fill", "steelblue");

  bars.exit().remove();

  const top10Data = data.slice(0, 10);
  x2.domain(top10Data.map(d => d.player));
  y2.domain([0, d3.max(top10Data, d => d[stat] + 200)]);

  svg2.selectAll(".x-axis2").remove();
  svg2.append("g")
    .attr("transform", `translate(0,${height2})`)
    .call(d3.axisBottom(x2))
    .attr("class", "x-axis2")
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-45)");

  svg2.selectAll(".y-axis2").remove();
  svg2.append("g")
    .call(d3.axisLeft(y2))
    .attr("class", "y-axis2");

  // Add a label for the second chart
  svg2.selectAll(".chart-title2").remove();
  svg2.append("text")
    .attr("class", "chart-title2")
    .attr("x", width2 / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .text("Top 10");

  let bars2 = svg2.selectAll(".bar2").data(top10Data);

  bars2.enter()
    .append("rect")
    .merge(bars2)
    .attr("x", d => x2(d.player))
    .attr("y", d => y2(d[stat]))
    .attr("width", x2.bandwidth())
    .attr("height", d => height2 - y2(d[stat]))
    .attr("class", "bar2")
    .attr("fill", "steelblue");

  bars2.exit().remove();

  // Update the third bar chart with the bottom 10 entries
  const bottom10Data = data.slice(-10);
  x3.domain(bottom10Data.map(d => d.player));
  y3.domain([0, d3.max(bottom10Data, d => d[stat])]);

  svg3.selectAll(".x-axis3").remove();
  svg3.append("g")
    .attr("transform", `translate(0,${height3})`)
    .call(d3.axisBottom(x3))
    .attr("class", "x-axis3")
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-45)");

    svg3.selectAll(".y-axis3").remove();
    svg3.append("g")
      .call(d3.axisLeft(y3))
      .attr("class", "y-axis3");

  // Add a label for the third chart
  svg3.selectAll(".chart-title3").data([0]).enter().append("text")
    .attr("class", "chart-title3")
    .attr("x", width3 / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .text("Bottom 10");

  let bars3 = svg3.selectAll(".bar3").data(bottom10Data);

  bars3.enter()
    .append("rect")
    .merge(bars3)
    .attr("x", d => x3(d.player))
    .attr("y", d => y3(d[stat]))
    .attr("width", x3.bandwidth())
    .attr("height", d => height3 - y3(d[stat]))
    .attr("class", "bar3")
    .attr("fill", "steelblue");

  bars3.exit().remove();
}
