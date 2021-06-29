/***********************************************************************/
//define the datafile
const healthData = 'assets/data.csv'

//set static svg/chart variables
var svgWidth = 1100;
var svgHeight = 800;

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
  .attr('height', svgHeight)
  .classed('chart', true);

//append svg to chart group
var chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

//set initial variables
var chosenX = 'smokes';
var chosenY = 'income';
var xText = 'Smokers (%)';
var yText = 'Median Income (USD)';
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
function yScale(data, Y) {

  let yLinScale = d3.scaleLinear()
    .domain([d3.min(data, (d) => d[Y]), d3.max(data, (d) => d[Y])])
    .range([chartHeight, 0]);

  return yLinScale;
}

//create x axis scale
function xScale(data, X) {

  let xLinScale = d3.scaleLinear()
    .domain([d3.min(data, (d) => d[X]), d3.max(data, (d) => d[X])])
    .range([0, chartWidth]);

  return xLinScale;
}

/***********************************************************************/
//create circles based on chosed data to transition between data points
function moveCirclesX(circlesGroup, newXScale, chosenX, stateLabels) {

  circlesGroup
    .attr("cx", d => newXScale(d[chosenX]));
  stateLabels
    .attr("x", d => newXScale(d[chosenX]))

  return circlesGroup, stateLabels;
}

function moveCirclesY(circlesGroup, newYScale, chosenY, stateLabels) {

  circlesGroup
    .attr('cy', d => newYScale(d[chosenY]));
  stateLabels
    .attr("y", d => newYScale(d[chosenY]) + 7);


  return circlesGroup;
}
/***********************************************************************/
//function to create the scatter chart
function createScatter(data) {

  //set x and y axis scales
  var xLinScale = xScale(data, chosenX);
  var yLinScale = yScale(data, chosenY);

  //add the axis to the chart
  let xAxis = d3.axisBottom(xLinScale);
  let yAxis = d3.axisLeft(yLinScale);
  chartGroup.append("g").classed('yAxisLine', true).call(yAxis);
  chartGroup.append("g").classed('xAxisLine', true).call(xAxis).attr("transform", `translate(0, ${chartHeight})`);

  //create scatter circles
  var scatterCircles = chartGroup.selectAll(".stateCircle")
      .data(data)
      .enter()
      .append("circle")
      .classed('.stateCircle', true)
      .attr("cx", d => xLinScale(d[chosenX]))
      .attr("cy", d => yLinScale(d[chosenY]))
      .attr("r", "15")
      .attr("fill", "#affaaf")
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
    .attr("class", "axisText yaxis active")
    .text("Median Income (USD)")
    .attr("value", 'income')
    .attr("transform", ` translate(-55, ${chartHeight / 2}) rotate(-90) scale(1.1)`);

    var yPoverty = chartGroup.append("text")
    .attr("class", "axisText yaxis inactive")
    .text("In Poverty (%)")
    .attr("value", 'poverty')
    .attr("transform", ` translate(-80, ${chartHeight / 2}) rotate(-90) scale(1.1)`);

    var yAge = chartGroup.append("text")
    .attr("class", "axisText yaxis inactive")
    .text("Age (Median)")
    .attr("value", 'age')
    .attr("transform", ` translate(-105, ${chartHeight / 2}) rotate(-90) scale(1.1)`);

  //add x-axes labels to chart
    var xSmokes = chartGroup.append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight)
      .attr("class", "axisText xaxis active")
      .text("Smokers (%)")
      .attr("value", 'smokes')
      .attr('transform', 'scale(1.1)');

    var xObesity = chartGroup.append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + 20)
      .attr("class", "axisText xaxis inactive")
      .text("Obesity (%)")
      .attr("value", 'obesity')
      .attr('transform', 'scale(1.1)');

    var xHealthcare = chartGroup.append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + 40)
      .attr("class", "axisText xaxis inactive")
      .text("Lacks Healthcare (%)")
      .attr("value", 'healthcare')
      .attr('transform', 'scale(1.1)');

    //add tooltip
    var toolTip = d3.tip()
                  .attr('class', 'd3-tip tooltip')
                  .html((event, d) => {
                    return `${d.state}<br>${xText}: ${d[chosenX]}<br>${yText}: ${d[chosenY]}`;
                  });
    chartGroup.call(toolTip);

    scatterCircles
      .on('mouseover', toolTip.show)
      .on('mouseout', toolTip.hide);

    stateLabels
      .on('mouseover', toolTip.show)
      .on('mouseout', toolTip.hide);

    //handle click event for x axis
    chartGroup.selectAll(".xaxis")
      .on("click", function() {
        //get value of selection
        var xValue = d3.select(this).attr("value");
        var newXText = d3.select(this).text();
        if (xValue !== chosenX) {

          chosenX = xValue;
          xText = newXText;
          xLinScale = xScale(data, chosenX);
          xAxis = d3.axisBottom(xLinScale);
          chartGroup
            .select('.xAxisLine')
            .call(xAxis)
            .attr("transform", `translate(0, ${chartHeight})`);
          chartGroup
            .select('.tooltip')
            .html((event, d) => {
              return `${d.state}<br>${xText}: ${d[chosenX]}<br>${yText}: ${d[chosenY]}`;
            });
          chartGroup.call(toolTip);
          circlesGroup = moveCirclesX(scatterCircles, xLinScale, chosenX, stateLabels);

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
          else if (chosenX === 'healthcare') {
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
          var newYText = d3.select(this).text();
          if (yValue !== chosenY) {

            chosenY = yValue;
            yText = newYText;
            yLinScale = yScale(data, chosenY);
            yAxis = d3.axisLeft(yLinScale);
            chartGroup
              .select('.yAxisLine')
              .call(yAxis);
            chartGroup
              .select('.tooltip')
              .html((event, d) => {
                return `${d.state}<br>${xText}: ${d[chosenX]}<br>${yText}: ${d[chosenY]}`;
              });
            chartGroup.call(toolTip);
            circlesGroup = moveCirclesY(scatterCircles, yLinScale, chosenY, stateLabels);

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
            else if (chosenY === 'poverty') {
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
            else if (chosenY === 'age') {
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
