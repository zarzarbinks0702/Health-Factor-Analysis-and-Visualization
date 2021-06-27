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

//set initial variables
var chosenX = 'smokes'
var chosenY = 'income'
/***********************************************************************/
//function for converting the relevant lines of the csv to integers
function rowUpdate(row) {
  row.income = +row.income;
  row.smokes = +row.smokes;
  row.healthcare = +row.healthcare;
  row.obesity = +row.obesity;
  row.poverty = +row.poverty;
  row.healthcare = +row.healthcare;
  return row;
}
/***********************************************************************/
//import the data
d3.csv(healthData, rowUpdate).then(createScatter);
/***********************************************************************/
//create y axis scale
function yScale(data, chosenX) {

  let yLinScale = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d[chosenX])])
    .range([chartHeight, 0]);

  return yLinScale;
}

//create x axis scale
function xScale(data, chosenY) {

  let xLinScale = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d[chosenY])])
    .range([0, chartWidth]);

  return xLinScale;
}
/***********************************************************************/
//following block from week 16-D3, Day 3, Activity 12
//update x axis when a label is clicked
function renderX(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

//update y axis when a label is clicked
function renderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}
/***********************************************************************/
//create circles based on chosed data to transition between data points
function renderCircles(circlesGroup, newXScale, chosenX, newYScale, chosenY) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenX]))
    .attr('cy', d => newYScale(d[chosenY]));

  return circlesGroup;
}
/***********************************************************************/
//function to create the scatter chart
function createScatter(data) {
  console.table(data);

  //set x and y axis scales
  var xLinScale = xScale(data, chosenX);
  var yLinScale = yScale(data, chosenY);

  //add the axis to the chart
  let xAxis = d3.axisBottom(xLinScale);
  let yAxis = d3.axisLeft(yLinScale);
  chartGroup.append("g").call(yAxis);
  chartGroup.append("g").call(xAxis).attr("transform", `translate(0, ${chartHeight})`);

  //create scatter circles
  var scatterCircles = chartGroup.selectAll(".stateCircle")
      .data(data)
      .enter()
      .append("circle")
      .classed('.stateCircle', true)
      .attr("cx", d => xLinScale(d[chosenX]))
      .attr("cy", d => yLinScale(d[chosenY]))
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
      .attr("x", d => xLinScale(d[chosenX]))
      .attr("y", d => yLinScale(d[chosenY]) + 7);

  //add y-axes labels to chart
    var yIncome = chartGroup.append("text")
    .attr("class", "axisText yaxis")
    .text("Median Income (USD)")
    .attr("transform", ` translate(-55, ${chartHeight / 1.4}) rotate(-90) scale(1.1)`);

    var yPoverty = chartGroup.append("text")
    .attr("class", "axisText yaxis")
    .text("In Poverty (%)")
    .attr("transform", ` translate(-80, ${chartHeight / 1.4}) rotate(-90) scale(1.1)`);

    var yAge = chartGroup.append("text")
    .attr("class", "axisText yaxis")
    .text("Age (Median)")
    .attr("transform", ` translate(-105, ${chartHeight / 1.4}) rotate(-90) scale(1.1)`);

  //add x-axes labels to chart
    var xSmokes = chartGroup.append("text")
      .attr("x", chartWidth / 2.5)
      .attr("y", chartHeight + 10)
      .attr("class", "axisText xaxis")
      .text("Smokers (%)")
      .attr('transform', 'scale(1.1)');

    var xObesity = chartGroup.append("text")
      .attr("x", chartWidth / 2.5)
      .attr("y", chartHeight + 35)
      .attr("class", "axisText xaxis")
      .text("Obesity (%)")
      .attr('transform', 'scale(1.1)');

    var xHealthcare = chartGroup.append("text")
      .attr("x", chartWidth / 2.5)
      .attr("y", chartHeight + 60)
      .attr("class", "axisText xaxis")
      .text("Lacks Healthcare (%)")
      .attr('transform', 'scale(1.1)');

    //handle click event for x axis
    chartGroup.selectAll(".xaxis")
      .on("click", function() {
        //get value of selection
        var xValue = d3.select(this).attr("value");
        if (xValue !== chosenX) {

          chosenX = xValue;
          xLinearScale = xScale(data, chosenX);
          xAxis = renderAxes(xLinearScale, xAxis);
          circlesGroup = renderCircles(circlesGroup, xLinScale, chosenX, newYScale, chosenY);

          if (chosenX === "smokes") {
            xSmokes
              .classed("active", true)
              .classed("inactive", false);
            xObesity
              .classed("active", false)
              .classed("inactive", true);
            xHealthcare
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenX === 'obesity') {
            xSmokes
              .classed("active", false)
              .classed("inactive", true);
            xObesity
              .classed("active", true)
              .classed("inactive", false);
            xHealthcare
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            xSmokes
              .classed("active", false)
              .classed("inactive", true);
            xObesity
              .classed("active", false)
              .classed("inactive", true);
            xHealthcare
              .classed("active", true)
              .classed("inactive", false);
            }
          }
        });
      //handle click event for y axis
      chartGroup.selectAll(".yaxis")
        .on("click", function() {
          //get value of selection
          var yValue = d3.select(this).attr("value");
          if (yValue !== chosenY) {

            chosenY = yValue;
            yLinearScale = yScale(data, chosenY);
            yAxis = renderAxes(yLinearScale, yAxis);
            circlesGroup = renderCircles(circlesGroup, xLinScale, chosenX, newYScale, chosenY);

            if (chosenY === "income") {
              yIncome
                .classed("active", true)
                .classed("inactive", false);
              yPoverty
                .classed("active", false)
                .classed("inactive", true);
              yAge
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenX === 'poverty') {
              yIncome
                .classed("active", false)
                .classed("inactive", true);
              yPoverty
                .classed("active", true)
                .classed("inactive", false);
              yAge
                .classed("active", false)
                .classed("inactive", true);
            }
            else {
              yIncome
                .classed("active", false)
                .classed("inactive", true);
              yPoverty
                .classed("active", false)
                .classed("inactive", true);
              yAge
                .classed("active", true)
                .classed("inactive", false);
              }
            }
          });
}
/***********************************************************************/
//handle click event for axes
