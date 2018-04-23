var draw_view2 = {
    height: 0,
    width: 0,
    div: 0,
    view: 0,
    groups: 0,
    map_color: 0,

    initialize: function() {
        var self = this;
        self.div = "#view2";
        self.width = $(self.div).width();
        self.height = $(self.div).height();

        var scale_ratio = self.width / 161 > self.height / 118 ? self.height / 118 : self.width / 161;
        scale_ratio = scale_ratio * 151;

        self.view = d3.select(self.div).append("svg")
            .attr("id", "view2")
            .attr("width", self.width)
            .attr("height", self.height);
        self.groups = self.view.append("g");
        self.map_color = "#BEBEBE";
        var projection = d3.geo.mercator()
            .center([107, 31])
            .scale(scale_ratio)
            .translate([self.width * 0.5, self.height * 0.68]);
        var path = d3.geo.path()
            .projection(projection);
        d3.json("data/china.json", function(error, root) {
            if (error) alert("error");
            self.groups.selectAll("path")
                .data(root.features)
                .enter()
                .append("path")
                .attr("class", "country")
                .style("fill", function(d, i) {
                    d.properties.id = self.map_color;
                    return d.properties.id;
                })
                .attr("d", path)
                .on("mouseover", function(d, i) {
                    console.log(d.properties.name)
                    d3.select(this).style("fill", "steelblue")
                    draw_view3.highlight_name(_.indexOf(location_list, d.properties.name), 1)
                    draw_view1.highlight_line(_.indexOf(location_list, d.properties.name), 1);
                    tooptip.html("地区:" + d.properties.name)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY + 20) + "px")
                        .style("opacity", 1);
                })
                .on("mouseout", function(d, i) {
                    d3.select(this).style("fill", self.map_color);
                    draw_view3.highlight_name(_.indexOf(location_list, d.properties.name), 0)
                    draw_view1.highlight_line(_.indexOf(location_list, d.properties.name), 0);

                    tooptip.style("opacity", 0.0);

                })
        })

    },
    highlight_location: function(index, flag) {
        var self = this;
        self.groups.selectAll("path").style("fill", function(d, i) {
            if (d.properties.name == location_list[index]) {
                if (flag == 1) d.properties.id = "steelblue";
                else d.properties.id = self.map_color;
            }
            return d.properties.id;
        })
    }
}