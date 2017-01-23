// var data = "http://services1.arcgis.com/dpmGqj7FxlwlvK0y/ArcGIS/rest/services/ky_pop_ksdc_simplify/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=county%2C+ky10_15%2C+ky15_20%2C+ky20_25%2C+ky25_30%2C+ky30_35%2C+ky35_40&returnGeometry=true&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&sqlFormat=none&f=pgeojson&token="

var data = "ky_pop_ksdc_simplify.topojson",
  width = $("#main").width(),
  height = $("#main").height(),
  colorScheme = ["#f44336","#ef9a9a","#F5F5F5","#90CAF9","#2196F3"];



// For Map
var colorScale = d3.scale.threshold()
  .domain([-5, -1, 1, 5])
  .range(colorScheme)
// For Legend
var color = d3.scale.ordinal()
  .domain(["< -5", "-5 - -1", "-1 - 1", "1 - 5", "> 5"])
  .range(colorScheme);

var legendRectSize = 18,
  legendSpacing = 4;

var legend  = d3.select("#legend-container")
  .append("svg")
  .append("g")
  .selectAll("g")
  .data(color.domain())
  .enter()
  .append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      var height = legendRectSize;
      var x = 0;
      var y = i * height;
      return "translate(" + x + "," + y +")";
    });
legend.append("rect")
  .attr("width", legendRectSize)
  .attr("height", legendRectSize)
  .style("fill", color)
  .style("stroke", color);
legend.append("text")
  .attr("x", legendRectSize + legendSpacing)
  .attr("y", legendRectSize + legendSpacing)
  .text(function(d) {return d;})
  .attr("x", 28)
  .attr("y", 14)
  .attr("fill", "#121212");


var svg = d3.select("#main")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "map")
var projection = d3.geo.albers()
  .center([0 ,37.8])
  .rotate([85.8, 0])
  .scale(12000)
  .translate([width / 2, height / 2]);

var geoPath = d3.geo.path()
  .projection(projection);


queue()
  .defer(d3.json, data)
  .await(ready);

function ready(error, counties){

  var attribute = "ky10_15";

  var counties = svg.append("g")
    .selectAll("path")
    .data(topojson.feature(counties, counties.objects.ky_pop_ksdc).features)
    .enter()
    .append("path")
    .attr("d", geoPath)
    .attr("class", "county")
    .attr("fill", function(d){
      return colorScale(d.properties[attribute]);
    })
    .on("mouseover", function(d){
      // d3.select("h2").text(d.properties.county);
      var p = d.properties;
      d3.select(this).attr("class", "county hover");
      d3.select("#info-county").text(p.county);
      d3.selectAll("input");
      yearData = this.id;
      d3.select("#p10_15").text(p.ky10_15);
      d3.select("#d10_15").text(p.n2015-p.c2010);
      d3.select("#p15_20").text(p.ky15_20);
      d3.select("#d15_20").text(p.n2020-p.n2015);
      d3.select("#p20_25").text(p.ky20_25);
      d3.select("#d20_25").text(p.n2025-p.n2020);
      d3.select("#p25_30").text(p.ky25_30);
      d3.select("#d25_30").text(p.n2030-p.n2025);
      d3.select("#p30_35").text(p.ky30_35);
      d3.select("#d30_35").text(p.n2035-p.n2030);
      d3.select("#p35_40").text(p.ky35_40);
      d3.select("#d35_40").text(p.n2040-p.n2035);
    })
    .on("mouseout", function(d){
      d3.select("h2").text("");
      d3.select(this).attr("class", "county");
      d3.selectAll(".data-value").remove();
    });

mapColor();

d3.selectAll("input").on("change", function(){
  attribute = this.id;
  mapColor();
})

function mapColor() {
  d3.selectAll(".county")
    .transition()
    .attr("fill", function(d){
      return colorScale(d.properties[attribute]);
    });
}

}
