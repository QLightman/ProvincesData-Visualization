var tooptip = d3.select("body")
    .append("div")
    .attr("class", "tooptip")
    .style("opacity", 0.0);
$(document).ready(function() {
    var wWidth = window.innerWidth;
    var wHeight = window.innerHeight;
    $("body").height(wHeight - 30);
    $("body").width(wWidth - 30);
    initialize();
});

function initialize() {

}