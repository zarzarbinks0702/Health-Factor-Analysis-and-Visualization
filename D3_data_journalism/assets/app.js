/***********************************************************************/
//define the datafile
const healthData = 'assets/data.csv'

//set static svg/chart variables
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 30,
  right: 40,
  bottom: 100,
  left: 100
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

//svg wrapper and append to index.html
var svg = d3.select('#scatter')
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
  row.smokes = +row.smokes;
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

  //create x axis scale (smokes)
  let xSmokesScale = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.smokes)])
    .range([0, chartWidth]);

  //add the axis to the chart
  let xAxis = d3.axisBottom(xSmokesScale);
  let yAxis = d3.axisLeft(yIncomeScale);
  chartGroup.append("g").call(yAxis);
  chartGroup.append("g").call(xAxis).attr("transform", `translate(0, ${chartHeight})`);

  //create scatter circles
  var scatterCircles = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xSmokesScale(d.smokes))
      .attr("cy", d => yIncomeScale(d.income))
      .attr("r", "15")
      .attr("fill", "blue")
      .attr("opacity", '0.5');

  //add state abbreveations to the circles
  var stateLabels = chartGroup.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text(d => `${d.abbr}`)
      .attr("x", d => xSmokesScale(d.smokes))
      .attr("y", d => yIncomeScale(d.income));
  //add axes labels to chart
    chartGroup.append("text")
    .attr("class", "axisText")
    .text("Median Income (USD)")
    .attr("transform", ` translate(-55, ${chartHeight / 1.4}) rotate(-90) scale(1.1)`);

  chartGroup.append("text")
    .attr("x", chartWidth / 2.5)
    .attr("y", chartHeight + 10)
    .attr("class", "axisText")
    .text("Smokers (%)")
    .attr('transform', 'scale(1.1)');
}
/***********************************************************************/
