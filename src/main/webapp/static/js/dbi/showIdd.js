$(function () {
    // 基于准备好的dom容器，初始化echarts实例，myChart为此容器中的echarts实例
    var myChart = echarts.init(document.getElementById('main'));

    $.get('roomSale/loadDbiRoomSale').done(function (data) {
        myChart.setOption({
            title: {
                text: '房间销售记录分析'
            },
            tooltip: {},
            toolbox: {  //工具
                feature: {
                    dataView: {}, //数据视图按钮
                    saveAsImage: {
                        pixelRatio: 5  //保存为图片
                    },
                    restore: {},
                    magicType : {show: true, type: ['line', 'bar']}
                }
            },
            legend: {  //柱状图的类型名称
                data:['销量']
            },
            xAxis: {  //横轴数据
                data: data.xAxis
            },
            yAxis: {},  //纵轴数据
            series: [{
                "name": "销量",
                "type": "bar",
                "data":data.seriesData   //加载图形的数据
            }]
        });
    });
})