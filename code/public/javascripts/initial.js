var file_name_list = ["城镇居民消费水平（元）", "地区生产总值(亿元)", "第二产业增加值（亿元）", "第三产业增加值（亿元）",
    "第一产业增加值（亿元）", "工业增加值（亿元）", "国际旅游外汇收入（亿元）", "建筑业增加值（亿元）", "交通运输、仓储和邮政业增加值（亿元）",
    "金融业增加值（亿元）", "农村居民消费水平（元）", "农林牧渔业增加值（亿元）", "批发和零售业增加值（亿元）", "住宿和餐饮业增加值（亿元）"
];
// var file_name_list = ["城镇居民消费", "地区生产总值", "第二产业增加", "第三产业增加",
//     "第一产业增加", "工业增加", "国际旅游收入", "建筑业增加", "交通仓储邮政增加",
//     "金融业增加", "农村居民消费", "农林牧渔业增加", "批发零售增加", "住宿餐饮增加"
// ];
var location_list = ["北京", "天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "上海",
    "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南", "广东", "广西",
    "海南", "重庆", "四川", "贵州", "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆"
];

var tooptip = d3.select("body")
    .append("div")
    .attr("class", "tooptip")
    .style("opacity", 0.0);
$(document).ready(function() {
    file_name_list.forEach((val, index) => {
        $("#property_select").append("<option value='" + (index) + "'>" + val + "</option>")
    });
    $('#property_select').chosen({
        width: "90%"
    });
    for (var i = 0; i < 10; i++) {
        $("#year_select").append("<option value='" + (i + 2007) + "'>" + (i + 2007) + "年度" + "</option>")
    }
    $('#year_select').chosen({
        width: "90%"
    });
    initialize();
});

function initialize() {
    draw_view1.initialize();
    draw_view2.initialize();
    draw_view3.initialize();
    draw_view1.draw($("#year_select").val());
    draw_view3.get_view3_data($("#property_select").val());
}
$("#property_select").change(function() {
    draw_view3.get_view3_data($(this).val());
})
$("#year_select").change(function() {
    draw_view1.draw($("#year_select").val());
})