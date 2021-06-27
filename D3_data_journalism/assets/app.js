/***********************************************************************/
//define the datafile
const healthData = 'assets/data.csv'

//set static svg/chart variables
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 30,
  right: 40,
  bottom: 125,
  left: 125
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
  var scatterCircles = chartGroup.selectAll(".stateCircle")
      .data(data)
      .enter()
      .append("circle")
      .classed('.stateCircle', true)
      .attr("cx", d => xSmokesScale(d.smokes))
      .attr("cy", d => yIncomeScale(d.income))
      .attr("r", "15")
      .attr("fill", "blue")
      .attr("opacity", '0.5');

  //add state abbreveations to the circles
  var stateLabels = chartGroup.selectAll(".stateText")
      .data(data)
      .enter()
      .append("text")
      .classed('stateText', true)
      .text(d => `${d.abbr}`)
      .attr("x", d => xSmokesScale(d.smokes))
      .attr("y", d => yIncomeScale(d.income) + 7);
  //add y-axes labels to chart
    chartGroup.append("text")
    .attr("class", "axisText")
    .text("Median Income (USD)")
    .attr("transform", ` translate(-55, ${chartHeight / 1.4}) rotate(-90) scale(1.1)`);

    chartGroup.append("text")
    .attr("class", "axisText")
    .text("In Poverty (%)")
    .attr("transform", ` translate(-80, ${chartHeight / 1.4}) rotate(-90) scale(1.1)`);

    chartGroup.append("text")
    .attr("class", "axisText")
    .text("Age (Median)")
    .attr("transform", ` translate(-105, ${chartHeight / 1.4}) rotate(-90) scale(1.1)`);
  //add x-axes labels to chart
  chartGroup.append("text")
    .attr("x", chartWidth / 2.5)
    .attr("y", chartHeight + 10)
    .attr("class", "axisText")
    .text("Smokers (%)")
    .attr('transform', 'scale(1.1)');

    chartGroup.append("text")
      .attr("x", chartWidth / 2.5)
      .attr("y", chartHeight + 35)
      .attr("class", "axisText")
      .text("Obesity (%)")
      .attr('transform', 'scale(1.1)');

      chartGroup.append("text")
        .attr("x", chartWidth / 2.5)
        .attr("y", chartHeight + 60)
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)")
        .attr('transform', 'scale(1.1)');

}
/***********************************************************************/
