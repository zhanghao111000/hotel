layui.use(['jquery','layer','table','form','laydate'],function  () {
    //新建内置模块对象
    var $ = layui.jquery,  //新建jquery对象
        layer = layui.layer,
        table = layui.table,
        form = layui.form,
        laydate = layui.laydate;
    //日期时间范围选择
    laydate.render({
        elem: '#test3'
        ,type: 'datetime'
        ,format:'yyyy/MM/dd HH:mm:ss'  //日期字符串格式
        ,range: true //或 range: '~' 来自定义分割字符
    });

    var selJsonRoomSale={};

    //初始化消费记录
    loadPageRoomSale();

    function loadPageRoomSale() {
        table.render({  //数据表格的数据渲染(此UI框架底层是进行异步加载)
            elem: '#demo'  //绑定容器  根据标签（数据容器）的id属性来
            ,height: 412   //容器高度
            //  ,width:1650  //容器宽度
            ,where:selJsonRoomSale
            ,limit: 3  //每一页显示的数据条数，默认值为10
            ,limits:[2,3,5,8,10,15,20]   //进行每一页数据条数的选择
            ,url: 'roomSale/loadPageByPramas' //访问服务器端的数据接口(异步请求)，返回的json格式的数据
            ,even:true  //每一行有渐变效果
            ,page: true //开启分页,此时会自动的将当前页page和每一页数据条数limit的数值传回服务器端
            ,cols: [[ //表头
                {type:'checkbox'}
                ,{field: 'id', title: 'ID', align:'center', width:80, sort: true,style:'color: #2ec770;'}
                ,{field: 'roomNum', title: '房间编号', align:'center', width:140,style:'color: #e74424;'}
                ,{field: 'customerName', title: '客人姓名', align:'center', width:120, sort: true,style:'color: #482baa;'}
                ,{field: 'startDate', title: '入住时间', align:'center', width:220,style:'color: #2b62aa;'}
                ,{field: 'endDate', title: '退房时间', align:'center', width: 220,style:'color: #dd38ef;'}
                ,{field: 'roomPrice', title: '单价', align:'center', width: 120, sort: true,style:'color: #e13759;'}
                ,{field: 'days', title: '天数', align:'center', width: 120, sort: true,style:'color: #2ec770;'}
                ,{field: 'rentPrice', title: '住宿金额', align:'center', width: 120, sort: true,style:'color: #482baa;'}
                ,{field: 'otherPrice', title: '其它消费', align:'center', width:120,style:'color: #2ec770;'}
                ,{field: 'salePrice', title: '支付金额', align:'center', width:120,style:'color: #dd38ef'}
                ,{field: 'discountPrice', title: '优惠金额', align:'center', width:120,style:'color: #2ec770;'}
                ,{fixed:'right', title: '操作', width:210, align:'center', toolbar: '#barDemo'}
            ]],
            done:function (res, curr, count) {  //执行分页是的函数回调；res为分页时服务器端的整个Map集合数据  curr为当前页  count为总的数据条数

            }
        });
    }
    //监听查询
    form.on('submit(demo1)', function(data){  //demo为按钮的lay-filter="demo1"属性中的值
        selJsonRoomSale={};
        if (data.field.queryTimes!=''){
            var arrDateBwt=data.field.queryTimes.split('-');
            selJsonRoomSale['startDate1']=arrDateBwt[0]
            selJsonRoomSale['endDate1']=arrDateBwt[1]
            //delete data.field.queryTimes
        }
        selJsonRoomSale['roomNum']=data.field.roomNum
        loadPageRoomSale();
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
});