/***********************************************************************/
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
  .select('.chart')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

//append svg to chart group
var chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

/***********************************************************************/
//helper function for pulling the relevant lines out of the csv
function rowUpdate(row) {
  row.abbr = +row.abbr;
  row.income = +row.income;
  row.obesity = +row.obesity;
  return row;
}
/***********************************************************************/

/***********************************************************************/
