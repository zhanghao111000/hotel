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
        /*,ready: function(){    // 可以选则不在一个月
            $(".laydate-main-list-0 .laydate-prev-m").click();
        }*/
    });


    var selJsonOrders={}; //查询的参数

    var currentPage=1;  //当前页

    loadPageOrders();//加载订单数据

    function loadPageOrders() {
        table.render({  //数据表格的数据渲染(此UI框架底层是进行异步加载)
            elem: '#demo'  //绑定容器  根据标签（数据容器）的id属性来
            ,height: 412   //容器高度
            //  ,width:1650  //容器宽度
            ,where:selJsonOrders
            ,limit: 3  //每一页显示的数据条数，默认值为10
            ,limits:[2,3,5,8,10,15,20]   //进行每一页数据条数的选择
            ,url: 'orders/loadPageByPramas' //访问服务器端的数据接口(异步请求)，返回的json格式的数据
            ,even:true  //每一行有渐变效果
            ,page: true //开启分页,此时会自动的将当前页page和每一页数据条数limit的数值传回服务器端
            ,cols: [[ //表头
                {type:'checkbox'}
                ,{field: 'id', title: 'ID', align:'center', width:80, sort: true}
                ,{field: 'orderNum', title: '订单编号', align:'center', width:220}
                ,{field: 'customerName', title: '客人名称', align:'center', width:120, sort: true,templet:'<div>{{d.inRoomInfo.customerName}}</div>'}
                ,{field: 'idcard', title: '身份证号', align:'center', width:120,templet:'<div>{{d.inRoomInfo.customerName}}</div>'}
                ,{field: 'isVip', title: 'vip', align:'center', width: 120,templet:'#isVipTpl'}
                ,{field: 'phone', title: '手机号', align:'center', width: 180, sort: true,templet:'<div>{{d.inRoomInfo.phone}}</div>'}
                ,{field: 'createDate', title: '下单时间', align:'center', width: 180, sort: true}
                ,{field: 'orderMoney', title: '总价', align:'center', width: 120, sort: true}
                ,{field: 'remark', title: '备注', align:'center', width:180}
                ,{field: 'orderStatus', title: '状态', align:'center', width:80,templet:'#orderStatusTpl'}
                ,{fixed:'right', title: '操作', width:210, align:'center', toolbar: '#barDemo',templet:'#barDemo'}
            ]],
            done:function (res, curr, count) {  //执行分页是的函数回调；res为分页时服务器端的整个Map集合数据  curr为当前页  count为总的数据条数
                currentPage=curr;
            }
        });
    }

    //监听查询
    form.on('submit(demo1)', function(data){  //demo为按钮的lay-filter="demo1"属性中的值
        if (data.field.queryTimes!=''){
            var arrDateBwt=data.field.queryTimes.split('-');
            selJsonOrders['startDate']=arrDateBwt[0]
            selJsonOrders['endDate']=arrDateBwt[1]
            delete data.field.queryTimes
        }else {
            delete selJsonOrders.startDate
            delete selJsonOrders.endDate
        }
        selJsonOrders['orderStatus']=data.field.orderStatus
        selJsonOrders['orderNum']=data.field.orderNum
        loadPageOrders();
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    //监听删除和支付订单
    table.on('tool(test)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）根据获取的值判断执行编辑或者删除操作
        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）
        if(layEvent === 'del'){ //删除
            layer.confirm('真的删除订单吗？', function(index){
                //向服务端发送修改指令 将显示状态改为隐藏状态
                updOrdersFlag(data.id,obj);
                layer.close(index);  //关闭当前弹框
            });
        } else if(layEvent === 'payUI'){ //支付订单
            //弹出支付界面
            window.open("model/toOrdersPay?orderNum="+data.orderNum+"&orderMoney="+data.orderMoney)
        }
    });

    //批量删除
    $("#batchBtn").click(function () {
        var checkStatus = table.checkStatus('demo'); //demo 即为数据表格容器基础参数 id 对应的值
        var data = checkStatus.data;  //获取选中行的数据，数组
        if(checkStatus.data.length!=0){ //获取选中行数量，可作为是否有选中行的条件
            layer.confirm('真的批量删除选中订单么？', function(index) {  //询问是否删除
                var ids = '';  //定义订单编号的字符串
                var batchOrderIf =true;// 定义是否能批量删除
                for (var i = 0; i < data.length; i++) {  //通过循环获取多个员工编号拼接在字符串中
                    if (data[i].orderStatus=='0'){
                        batchOrderIf=false;
                        break;
                    }
                    ids += data[i].id + ",";  //拼接
                }
                if (batchOrderIf){
                    ids = ids.substring(0, ids.length - 1);
                    //console.log(ids)
                    //批量删除（修改显示状态）
                    updBatchOrdersFlag(ids);
                } else {
                    layer.msg("你选中的订单还有未支付的！！！",{icon: 3,time:2000,anim: 4,shade:0.5});
                }
                layer.close(index);  //关闭当前弹框
            });
        }else {
            layer.msg("你还未选中订单数据！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
        }
    });

    //删除订单数据（将显示状态改为隐藏状态）
    function updOrdersFlag(id,obj) {
        $.ajax({
            type:'POST',
            url:'orders/updByPrimaryKeySelective',
            data:{"id":id,"flag":"0"},
            success:function (data) {
                if(data=="success"){
                    //icon: 1弹出信息的图标类型（0-7）；time:2000弹出时间2s；anim: 4弹出方式（0-6）；shade:0.5背景颜色深浅（0-1）
                    layer.msg("订单删除成功。。", {icon: 1,time:2000,anim: 4,shade:0.5})
                    obj.del(); //删除对应行（tr）的DOM结构，并更新页面缓存
                }else {
                    layer.msg("订单删除失败！！", {icon: 2,time:2000,anim: 3,shade:0.5})
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
    //批量删除（修改显示状态）
    function  updBatchOrdersFlag(ids) {
        $.ajax({
            type:'POST',
            url:'orders/updBatchByPrimaryKeySelective',
            data:{"ids":ids,"flag":"0"},
            success:function (data) {
                if(data=="success"){
                    //icon: 1弹出信息的图标类型（0-7）；time:2000弹出时间2s；anim: 4弹出方式（0-6）；shade:0.5背景颜色深浅（0-1）
                    layer.msg("订单批量删除成功。。", {icon: 1,time:2000,anim: 4,shade:0.5})
                    //数据表格重载
                    table.reload('demo', {  //demo为table表格容器id
                        page: {
                            curr: currentPage //重新从第 currentPage(当前页) 页开始
                        }
                    }); //只重载数据
                }else {
                    layer.msg("订单批量删除失败！！", {icon: 2,time:2000,anim: 3,shade:0.5})
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
    
})