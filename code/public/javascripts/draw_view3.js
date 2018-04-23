var draw_view3 = {
    data: 0,
    height: 0,
    width: 0,
    div: 0,
    view: 0,
    graph_line_class: 0,
    yScale: 0,
    xScale: 0,
    stroke_color: 0,
    initialize: function() {
        var self = this;
        self.div = "#view3";
        self.width = $(self.div).width();
        self.height = $(self.div).height();
        self.view = d3.select(self.div).append("svg")
            .attr("id", "view3_graph")
            .attr("width", self.width)
            .attr("height", self.height);
        self.stroke_color = "steelblue";
    },
    get_view3_data: function(index) {
        var self = this;
        d3.text("data/property_data/" + index + ".txt", function(error, data) {
            if (error) console.log(error);
            data = data.toString().split("\n");
            for (var index in data) {
                data[index] = data[index].toString().split(",");
                for (var j = 0; j < data[index].length; j++) {
                    data[index][j] = parseFloat(data[index][j])
                }
            }
            console.log(data)
            self.draw(data);
        })
    },
    generate_line_data: function(data, index) {
        var self = this;

        function LINE() {}
        LINE.prototype.id = 0;
        LINE.prototype.x1 = 0;
        LINE.prototype.x2 = 0;
        LINE.prototype.y1 = 0;
        LINE.prototype.y2 = 0;
        var line_class = new Array();
        for (var i = 0; i < 9; i++) {
            line_class[i] = new LINE();
            line_class[i].id = index;
            line_class[i].x1 = self.width * 0.1 + self.width * 0.8 / 9 * i;
            line_class[i].x2 = self.width * 0.1 + self.width * 0.8 / 9 * (i + 1);
            line_class[i].y1 = self.height * 0.8 - self.yScale((data[9 - i]));
            line_class[i].y2 = self.height * 0.8 - self.yScale((data[8 - i]));
        }
        return line_class;

    },
    draw: function(data) {
        var self = this;
        self.remove();
        var tmp_array = [];
        for (var i = 0; i < data.length; i++) tmp_array.push(_.max(data[i]));
        var max = _.max(tmp_array);
        tmp_array = [];
        for (var i = 0; i < data.length; i++) tmp_array.push(_.min(data[i]));
        var min = _.min(tmp_array);
        console.log(max + " " + min)

        self.yScale = d3.scale.linear()
            .domain([min, max])
            .range([0, self.height * 0.7]);
        var yAxis = d3.svg.axis()
            .scale(self.yScale)
            .ticks(8)
            .orient("left");
        self.yScale.range([self.height * 0.7, 0]);

        self.xScale = d3.scale.linear()
            .domain([2007, 2016])
            .range([0, self.width * 0.8]);
        var xAxis = d3.svg.axis()
            .scale(self.xScale)
            .ticks(10)

        var gxAxis = self.view.append("g")
            .attr("id", "view3_gx")
            .attr("transform", 'translate(' + (self.width * 0.1) + ',' + (self.height * 0.8) + ')')
            .attr("class", "axis");

        var gyAxis = self.view.append("g")
            .attr("id", "view3_gy")
            .attr("transform", 'translate(' + (self.width * 0.1) + ',' + (self.height * 0.1) + ')')
            .attr("class", "axis");
        gxAxis.call(xAxis);
        gyAxis.call(yAxis);
        self.yScale.range([0, self.height * 0.7]);

        console.log(self.generate_line_data(data[2], 2))
        self.graph_line_class = new Array(location_list.length);
        for (var index = 0; index < location_list.length; index++) {
            self.graph_line_class[index] = self.view.append("g")
                .attr("id", "view3_line" + index)
                .attr("stroke-width", 1)
                .attr("stroke", self.stroke_color)
                .selectAll("line")
                .data(self.generate_line_data(data[index], index))
                .enter().append("line")
                .attr("x1", function(d, i) {
                    return d.x1;
                })
                .attr("x2", function(d, i) {
                    return d.x2;
                })
                .attr("y1", function(d, i) {
                    return d.y1;
                })
                .attr("y2", function(d, i) {
                    return d.y2;
                })
                .on("mouseover", function(d, i) {
                    self.highlight_name(d.id, 1)
                    draw_view2.highlight_location(d.id, 1)
                    draw_view1.highlight_line(d.id, 1);
                    var string = "地区:" + location_list[d.id];
                    for (var i = 0; i < 5; i++) {
                        string += "<br>" + (2007 + 2 * i) + ": " + data[d.id][9 - 2 * i] + '&nbsp&nbsp&nbsp' + (2007 + 2 * i + 1) + ": " + data[d.id][8 - 2 * i];
                    }
                    tooptip.html(string)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY + 20) + "px")
                        .style("opacity", 1);
                })
                .on("mouseout", function(d, i) {
                    self.highlight_name(d.id, 0)
                    draw_view2.highlight_location(d.id, 0)
                    draw_view1.highlight_line(d.id, 0);

                    tooptip.style("opacity", 0.0);
                })
        }
    },
    highlight_name: function(id, flag) {
        var self = this;
        if (flag == 1)
            self.graph_line_class[id].attr("stroke", "red")
            .attr("stroke-width", 3);
        else self.graph_line_class[id].attr("stroke", self.stroke_color)
            .attr("stroke-width", 1);
    },
    remove: function() {
        var self = this;
        self.view.selectAll("*").remove();
    }
}