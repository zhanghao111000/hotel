layui.use(['jquery','layer','table','form','laydate'],function  () {
    //新建内置模块对象
    var $ = layui.jquery,  //新建jquery对象
        layer = layui.layer,
        table = layui.table,
        form = layui.form,
        laydate = layui.laydate;

    //当前页
    var currentPage=1;

    table.render({  //数据表格的数据渲染(此UI框架底层是进行异步加载)
        elem: '#demo'  //绑定容器  根据标签（数据容器）的id属性来
        ,height: 412   //容器高度
      //  ,width:1650  //容器宽度
        ,limit: 3  //每一页显示的数据条数，默认值为10
        ,limits:[2,3,5,8,10,15,20]   //进行每一页数据条数的选择
        ,url: 'inRoomInfo/loadPageByPramas' //访问服务器端的数据接口(异步请求)，返回的json格式的数据
        ,even:true  //每一行有渐变效果
        ,page: true //开启分页,此时会自动的将当前页page和每一页数据条数limit的数值传回服务器端
        ,cols: [[ //表头
            {type:'checkbox'}
            ,{field: 'id', title: 'ID', align:'center', width:80, sort: true}
            ,{field: 'roomNum', title: '房间号', align:'center', width:120,templet:'<div>{{d.rooms.roomNum}}</div>'}
            ,{field: 'roomPic', title: '封面图', align:'center', width:120, sort: true,templet:'<div><img src="{{d.rooms.roomPic}}"></div>'}
            ,{field: 'roomTypeName', title: '类型', align:'center', width:120,templet:'<div>{{d.rooms.roomType.roomTypeName}}</div>'}
            ,{field: 'roomPrice', title: '价格', align:'center', width: 120,templet:'<div>{{d.rooms.roomType.roomPrice}}</div>'}
            ,{field: 'customerName', title: '客人姓名', align:'center', width: 100, sort: true}
            ,{field: 'gender', title: '性别', align:'center', width: 80, sort: true,templet:'#genderTpl'}
            ,{field: 'idcard', title: '身份证号', align:'center', width: 210, sort: true}
            ,{field: 'isVip', title: '会员', align:'center', width:80,templet:'#isVipTpl'}
            ,{field: 'phone', title: '手机号', align:'center', width:150}
            ,{field: 'money', title: '押金', align:'center', width:100}
            ,{field: 'createDate', title: '入住时间', align:'center', width:210}
            ,{field: 'outRoomStatus', title: '状态', align:'center', width:80,templet:'#barDemo',templet:'#outRoomStatusTpl'}
            ,{fixed:'right', title: '操作', width:210, align:'center', toolbar: '#barDemo',templet:'#barDemo'}
        ]],
        done:function (res, curr, count) {  //执行分页是的函数回调；res为分页时服务器端的整个Map集合数据  curr为当前页  count为总的数据条数
           hoverOpenImg();
           currentPage=curr;
        }
    });
    table.on('tool(test)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）根据获取的值判断执行编辑或者删除操作
        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）
        if(layEvent === 'del'){ //删除
            layer.confirm('真的删除入住信息吗？', function(index){
                //向服务端发送修改指令 将显示状态改为隐藏状态
                updInRoomInfoStatus(obj);
                layer.close(index);  //关闭当前弹框
            });
        } else if(layEvent === 'edit'){ //退房
            $("#otherPrice").val("0") //其他消费
            $("#remark").val("")  //退房备注
            var isVip;
            if (data.isVip==1){
                isVip ='是'
                loadvipNum(data.idcard)//查询会员卡号
            }else {
                isVip ='否'
                $("#vipRate").val("1")
                $("#vipNum").val("")
            }
            //1.数据回显
            form.val("exitInRoomInfoForm", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                "inRoomInfo_id":data.id
                ,"roomNum":data.rooms.roomNum // "name": "value"
                ,"customerName": data.customerName
                ,"idcard":data.idcard
                ,"isVip": isVip
                ,"roomPrice": data.rooms.roomType.roomPrice
                ,"createDate": data.createDate
            });
            var nowDate=getNowDate(new Date());
            $("#endDate").val(nowDate) //显示退房时间
            var days=getDays(getDateStr(data.createDate),getDateStr(nowDate))
            if(days=='0'){
                days='1'    //当天入住 当天退房  按一天算
            }
            $("#days").text(days)
            var zprice =days*data.rooms.roomType.roomPrice*$("#vipRate").val()
            $("#zprice").text(zprice)
            //2.弹出退房页面
            layer.open({
                type:1,  //弹出类型
                title:"用户修改界面",  //弹框标题
                area:['800px','630px'],  //弹框款高度
                anim: 4,  //弹出的动画效果
                shade:0.5,  //阴影遮罩
                content:$("#exitInRoomInfoDiv")  //弹出的内容
            });
            $("#otherPrice").blur(function () {
                if ($(this).val()!=''){
                    $("#zprice").text(parseFloat($(this).val())+zprice)
                }else {
                    $("#zprice").text(zprice)
                }
            })
            //3获得退房参数，执行退房
            form.on('submit(demo3)', function(data){
                var nowDate=getNowDate(new Date());
                var saveJsonOrders={}; //添加订单数据
                saveJsonOrders['orderNum']=dateReplace(nowDate)+getRandom(6)  //订单编号
                saveJsonOrders['orderMoney']=$("#zprice").text()      //订单总价
                saveJsonOrders['remark']=data.field.remark    //订单备注
                saveJsonOrders['orderStatus']='0'   //0未结算，1已结算
                saveJsonOrders['iriId']=data.field.inRoomInfo_id   //入住信息主键
                saveJsonOrders['createDate']=nowDate      //下单时间
                saveJsonOrders['flag']='1'  //1显示，0隐藏
                //退房时的客人信息时间等等(房间编号，客人姓名，入住时间，退房时间，入住天数)
                saveJsonOrders['orderOther']=data.field.roomNum+','+data.field.customerName+','+data.field.createDate+','+data.field.endDate+','+$("#days").text()
                //退房时的各种金额(房间单价，其他消费，入住房间金额)
                saveJsonOrders['orderPrice']=data.field.roomPrice+','+data.field.number+','+zprice
                saveOrder(saveJsonOrders); //服务器执行订单的添加
                layer.closeAll(); //关闭当前页面中所有弹框
                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            });
        }
    });
    //删除已退房的入住信息
    function updInRoomInfoStatus(obj){
        $.ajax({
            type:'POST',
            url:'inRoomInfo/updByPrimaryKeySelective',
            data:{"id":obj.data.id,"status":"0"},
            success:function (data) {
                if(data=="success"){
                    //icon: 1弹出信息的图标类型（0-7）；time:2000弹出时间2s；anim: 4弹出方式（0-6）；shade:0.5背景颜色深浅（0-1）
                    layer.msg("入住信息删除成功。。", {icon: 1,time:2000,anim: 4,shade:0.5})
                    obj.del(); //删除对应行（tr）的DOM结构，并更新页面缓存
                }else {
                    layer.msg("入住信息删除失败！！", {icon: 2,time:2000,anim: 3,shade:0.5})
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
    //查询会员卡号
    function loadvipNum(idcard){
        $.ajax({
            type:'POST',
            url:'vip/loadOneByPramas',
            data:{"idcard":idcard},
            async:false,
            success:function (data) {
                $("#vipNum").val(data.vipNum)
                $("#vipRate").val(data.vipRate)
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
    //添加订单数据
    function saveOrder(saveJsonOrders){
        $.ajax({
            type:'POST',
            url:'orders/save',
            data:saveJsonOrders,
            success:function (data) {
                if(data=="success"){
                    layer.msg("退房成功。。。", {icon: 1,time:2000,anim: 3,shade:0.5})
                    //数据表格重载
                    table.reload('demo', {  //demo为table表格容器id
                        page: {
                            curr: currentPage //重新从第 currentPage(当前页) 页开始
                        }
                    }); //只重载数据
                }else {
                    layer.msg("退房失败！！！！", {icon: 2,time:2000,anim: 3,shade:0.5})
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    //图片放大镜函数
    function hoverOpenImg(){
        var img_show = null; // tips提示
        $('td img').hover(function(){
            var img = "<img class='img_msg' src='"+$(this).attr('src')+"' style='width:230px;' />";
            img_show = layer.tips(img, this,{
                tips:[2, 'rgba(41,41,41,.5)']
                ,area: ['260px']
            });
        },function(){
            layer.close(img_show);
        });
        $('td img').attr('style','max-width:70px');
    }
    //获取当前时间字符串     Date()   ---->  yyyy/MM/dd HH:mm:ss 格式的字符串
    function getNowDate(date) {
        var sign1 = "/";
        var sign2 = ":";
        var year = date.getFullYear() // 年
        var month = date.getMonth() + 1; // 月
        var day  = date.getDate(); // 日
        var hour = date.getHours(); // 时
        var minutes = date.getMinutes(); // 分
        var seconds = date.getSeconds() //秒
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (day >= 0 && day <= 9) {
            day = "0" + day;
        }
        if (hour >= 0 && hour <= 9) {
            hour = "0" + hour;
        }
        if (minutes >= 0 && minutes <= 9) {
            minutes = "0" + minutes;
        }
        if (seconds >= 0 && seconds <= 9) {
            seconds = "0" + seconds;
        }
        var currentdate = year + sign1 + month + sign1 + day + " " + hour + sign2 + minutes + sign2 + seconds ;
        return currentdate;
    }
    //计算天数
    function getDays(startDate,endDate){  //2019/09/09   2019/10/10
        var date1Str = startDate.split("/");
        var date1Obj = new Date(date1Str[0],(date1Str[1]-1),date1Str[2]);
        var date2Str = endDate.split("/");
        var date2Obj = new Date(date2Str[0],(date2Str[1]-1),date2Str[2]);
        var t1 = date1Obj.getTime();
        var t2 = date2Obj.getTime();
        var datetime=1000*60*60*24;
        var minusDays = Math.floor(((t2-t1)/datetime));
        var days = Math.abs(minusDays);
        return minusDays;
    }

    //将目前的时间格式2019/08/06 12:12:08  -->  2019/08/06
    function getDateStr(dateStr) {
        var indexOf = dateStr.indexOf(" ");  //取到" "的下标
        dateStr = dateStr.substring(0,indexOf);  //第1个参数为下标，第2个参数为切割的字符串长度
        return dateStr;
    }
    //把 2019/01/01 12:12:12  -->  20190101121212
    function dateReplace(date) {
        date = date.replace("/","");
        date = date.replace("/","");
        date = date.replace(" ","");
        date = date.replace(":","");
        date = date.replace(":","");
        return date;
    }

    //获取随机数
    function getRandom(num) {
        var count = '';   //随机数
        for (var i=0;i<num;i++){
            count += parseInt(Math.random()*10)  //0.123123123...
        }
        return count;
    }
})