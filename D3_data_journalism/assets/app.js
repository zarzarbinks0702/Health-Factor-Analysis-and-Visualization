/***********************************************************************/
//define the datafile
const healthData = 'assets/data.csv'

//set static svg/chart variables
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

//svg wrapper and append to index.html
var svg = d3
  .select('#scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

//append svg to chart group
var chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

/***********************************************************************/
//function for converting the relevant lines of the csv to integers
function rowUpdate(row) {
  row.income = +row.income;
  row.obesity = +row.obesity;
  return row;
}
/***********************************************************************/
//import the data
d3.csv(healthData, rowUpdate).then(createScatter);
/***********************************************************************/
//function to create the scatter chart
function createScatter(data) {
  console.table(data);

  //create y axis scale (income)
  let yIncomeScale = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.income)])
    .range([chartHeight, 0]);

  //create x axis scale (obesity)
  let xObesityScale = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.obesity)])
    .range([0, chartWidth]);

  //add the axis to the chart
  let xAxis = d3.axisBottom(xObesityScale);
  let yAxis = d3.axisLeft(yIncomeScale);
  chartGroup.append("g").call(yAxis);
  chartGroup.append("g").call(xAxis).attr("transform", `translate(0, ${chartHeight})`);

  //create scatter circles
  var scatterCircles = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xObesityScale(d.obesity))
      .attr("cy", d => yIncomeScale(d.income))
      .attr("r", "15")
      .attr("fill", "blue")
      .attr("opacity", '0.5');
}
/***********************************************************************/
