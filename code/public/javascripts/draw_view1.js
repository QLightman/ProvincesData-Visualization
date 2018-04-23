var draw_view1 = {
    height: 0,
    width: 0,
    div: 0,
    view: 0,
    groups: 0,
    map_color: 0,
    foreground: 0,
    g: 0,
    initialize: function() {
        var self = this;
        var margin = {
            top: 30,
            right: 10,
            bottom: 10,
            left: 10
        };
        self.div = "#view1";
        self.width = $(self.div).width() - margin.left - margin.right;
        self.height = $(self.div).height() - margin.top - margin.bottom;

        self.view = d3.select(self.div).append("svg")
            .attr("id", "view1_graph")
            .attr("width", self.width + margin.left + margin.right)
            .attr("height", self.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    },
    draw: function(index) {
        var self = this;
        self.remove();
        var x = d3.scale.ordinal().rangePoints([0, self.width], 1),
            y = {},
            dragging = {};

        var line = d3.svg.line(),
            axis = d3.svg.axis().orient("left"),
            background;
        d3.csv("data/year_data/" + index + ".csv", function(error, _year) {

            // Extract the list of dimensions and create a scale for each.
            x.domain(dimensions = d3.keys(_year[0]).filter(function(d) {
                return d != "name" && (y[d] = d3.scale.linear()
                    .domain(d3.extent(_year, function(p) {
                        return +p[d];
                    }))
                    .range([self.height, 0]));
            }));

            // Add grey background lines for context.
            background = self.view.append("g")
                .attr("class", "background")
                .attr("id", "view1_background")
                .selectAll("path")
                .data(_year)
                .enter().append("path")
                .attr("d", path);

            // Add blue foreground lines for focus.
            self.foreground = self.view.append("g")
                .attr("class", "foreground")
                .attr("id", "view1_foreground")
                .selectAll("path")
                .data(_year)
                .enter().append("path")
                .attr("d", path);

            // Add a group element for each dimension.
            self.g = self.view.selectAll(".dimension")
                .data(dimensions)
                .enter().append("g")
                .attr("class", "dimension")
                .attr("transform", function(d) {
                    return "translate(" + x(d) + ")";
                })
                .call(d3.behavior.drag()
                    .origin(function(d) {
                        return {
                            x: x(d)
                        };
                    })
                    .on("dragstart", function(d) {
                        dragging[d] = x(d);
                        background.attr("visibility", "hidden");
                    })
                    .on("drag", function(d) {
                        dragging[d] = Math.min(self.width, Math.max(0, d3.event.x));
                        self.foreground.attr("d", path);
                        dimensions.sort(function(a, b) {
                            return position(a) - position(b);
                        });
                        x.domain(dimensions);
                        self.g.attr("transform", function(d) {
                            return "translate(" + position(d) + ")";
                        })
                    })
                    .on("dragend", function(d) {
                        delete dragging[d];
                        transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                        transition(self.foreground).attr("d", path);
                        background
                            .attr("d", path)
                            .transition()
                            .delay(500)
                            .duration(0)
                            .attr("visibility", null);
                    }));

            // Add an axis and title.
            self.g.append("g")
                .attr("class", "axis")
                .attr("id", "view1_axis")
                .each(function(d) {
                    d3.select(this).call(axis.scale(y[d]));
                })
                .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(function(d) {
                    return d;
                });

            // Add and store a brush for each axis.
            self.g.append("g")
                .attr("class", "brush")
                .each(function(d) {
                    d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
                })
                .selectAll("rect")
                .attr("x", -8)
                .attr("width", 16);
        });

        function position(d) {
            var v = dragging[d];
            return v == null ? x(d) : v;
        }

        function transition(g) {
            return g.transition().duration(500);
        }

        // Returns the path for a given data point.
        function path(d) {
            return line(dimensions.map(function(p) {
                return [position(p), y[p](d[p])];
            }));
        }

        function brushstart() {
            d3.event.sourceEvent.stopPropagation();
        }

        // Handles a brush event, toggling the display of foreground lines.
        function brush() {
            var actives = dimensions.filter(function(p) {
                    return !y[p].brush.empty();
                }),
                extents = actives.map(function(p) {

                    return y[p].brush.extent();
                });
            self.foreground.style("display", function(d, index) {
                var tmp = actives.every(function(p, i) {
                    return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                }) ? null : "none";
                if (tmp == null) {
                    draw_view2.highlight_location(index, 1);
                    draw_view3.highlight_name(index, 1);
                }
                if (tmp == "none") {
                    draw_view2.highlight_location(index, 0);
                    draw_view3.highlight_name(index, 0);
                }
                return tmp;
            });
        }
    },
    highlight_line: function(index, flag) {
        var self = this;
        self.foreground.style("display", function(d, i) {
            if (flag == 0) return null;
            if (index == i && flag == 1)
                return null;
            return "none";
        });
    },
    remove: function() {
        var self = this;
        self.view.selectAll("*").remove();
    }
}