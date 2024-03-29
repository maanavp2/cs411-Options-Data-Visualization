// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var form = document.getElementById('frm');

// Parse the Data
function getData() {
	d3.json("http://18.220.144.204:5000/volume?date="+form['date'].value, function(data) {
    let max = 0;
		
	// X axis
	var x = d3.scaleBand()
	  .range([ 0, width ])
	  .domain(data.map(function(d) { return d[0]; }))
	  .padding(0.2);
	svg.append("g")
	  .attr("transform", "translate(0," + height + ")")
	  .call(d3.axisBottom(x))
	  .selectAll("text")
		.attr("transform", "translate(-10,0)rotate(-45)")
		.style("text-anchor", "end");

	// Add Y axis
	var y = d3.scaleLinear()
	  .domain([0, 1000000])
	  .range([ height, 0]);
	svg.append("g")
	  .call(d3.axisLeft(y));

	// Bars
	svg.selectAll("mybar")
	  .data(data)
	  .enter()
	  .append("rect")
		.attr("x", function(d) { return x(d[0]); })
		.attr("y", function(d) { return y(d[1]); })
		.attr("width", x.bandwidth())
		.attr("height", function(d) { return height - y(d[1]); })
		.attr("fill", "#69b3a2")

	})
	svg.selectAll("*").remove()
}	
