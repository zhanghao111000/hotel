layui.use(['jquery','layer','table','form','laydate'],function  () {
    //新建内置模块对象
    var $ = layui.jquery,  //新建jquery对象
        layer = layui.layer,
        table = layui.table,
        form = layui.form,
        laydate = layui.laydate;

    //执行一个laydate实例
    laydate.render({
        elem: '#createDate' //指定元素的id
        ,type:'datetime'  //日期格式
        ,format:'yyyy/MM/dd HH:mm:ss'  //日期字符串格式
        ,value:new Date()
        ,min:0   //只能选当前时间之后的时间
    });

    var checkIdcardIf=false; //身份证号的唯一的结果

    var checkPhoneIf=false;//手机号的唯一的结果

      loadRooms('0');  //初始化所有空闲房间

    //手机号唯一性验证
    $("#phone").blur(function () {
        //向服务器发送请求根据条件查询数据条数
        loadVipCount($(this).val());
    })
    //身份证号唯一性验证
    $("#idcard").blur(function () {
        //向服务器发送请求根据条件查询数据条数
        loadVipIdCardCount($(this).val());
    })

    //监听是否会员单选框
    form.on('radio(isVip)', function(data){
        $("form").eq(0).find("input:text").val("")   //清空显示数据
        if (data.value!=1) {
            $("#vip_num").val("")
            noVip();
        }else {
            isVip();
        }
    });
    //会员卡号绑定失去焦点事件
    $("#vip_num").blur(function () {
        var vipNum =$(this).val()
        if(/(^[1-9]\d*$)/.test(vipNum)) {
            if (vipNum.length==16){
                //根据会员卡号查询单个会员数据
                loadVip(vipNum);
            } else {
                layer.tips('会员卡号长度为16位','#vip_num',{tips: [2,'red'],time:2000})
            }
        }else {
            //吸附框
            layer.tips('会员卡号只能为正整数','#vip_num',{tips: [2,'red'],time:2000})
        }
    })
    //监听添加入住信息
    form.on('submit(demo1)', function(data){
       // console.log(data.field)
        //服务器执行添加 1.添加入住信息  2 修改房间状态
        saveJsonInRoomInfo=data.field
        saveJsonInRoomInfo['outRoomStatus']='0'  //退房状态
        saveJsonInRoomInfo['status']='1'  //显示状态
        saveInRoomInfo(saveJsonInRoomInfo)
        layer.closeAll(); //关闭当前页面中所有弹框
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    //自定义表单验证
    form.verify({
        vip_num: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(value<=0){
                return '会员卡号有误！';
            }
            if(value.length!=16){
                return '会员卡号长度必须为16位！';
            }
        },
        money:function (value,item) {
            if (value<200 || value>1000){
                return '押金范围再200到1000！'
            }
        }
    });

    //自定义表单验证
    form.verify({
        //手机号唯一性验证
        checkPhone: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(!checkPhoneIf){
                return '改手机号会员已存在！';
            }
        },
        checkIdcard: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(!checkIdcardIf){
                return '改身份证号会员已存在！';
            }
        }
    });
    //加载所有空闲房间
    function loadRooms(roomStatus) {
        $.ajax({
            type:'POST',
            url:'rooms/loadManyByPramas',
            data:{"roomStatus":roomStatus},
            success:function (data) {
                var roomStr='<option value="">--请选择房间--</option>'
                $.each(data,function (i,room) {
                    roomStr +='<option value="'+room.id+'">'+room.roomNum+'-'+room.roomType.roomTypeName+'-'+room.roomType.roomPrice+'</option>'
                })
                $("#selRoomNumId").html(roomStr)
                form.render('select')
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
    //根据会员卡号查询单个会员数据
    function loadVip(vipNum) {
        $.ajax({
            type:'POST',
            url:'vip/loadOneByPramas',
            data:{"vipNum":vipNum},
            async:false,
            success:function (data) {
                if (data!=''){
                    //回显会员数据
                    form.val("example", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                        "gender":data.gender   //性别
                        ,"customerName":data.customerName  //客人姓名
                        ,"idcard": data.idcard  //身份证号
                        ,"phone":data.phone  //手机号
                    });
                } else {
                    layer.tips('会员卡号不存在','#vip_num',{tips: [2,'red'],time:2000})
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
    //添加入住信息
    function  saveInRoomInfo(saveJsonInRoomInfo) {
        $.ajax({
            type:'POST',
            url:'inRoomInfo/save',
            data:saveJsonInRoomInfo,
            success:function (data) {
                if (data=='success'){
                    layer.msg("入住信息添加成功。。。",{icon: 1,time:2000,anim: 4,shade:0.5});
                    //定时器，2s后跳转到入住信息显示页面
                    setTimeout('window.location="model/toShowInRoomInfo"',2000);
                } else {
                    layer.msg("入住信息添加失败！！！",{icon: 2,time:2000,anim: 3,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
    //是会员
    function isVip() {
        checkPhoneIf=true;
        checkIdcardIf=true;
        $("#vip_num").removeAttr("disabled")  //会员卡号可用
        $("#vip_num").attr("lay-verify","required|number|vip_num")  //加上表单验证
        $("#customerName").attr("disabled","disabled")  //客人姓名不可用
        $("input[name=gender]").attr("disabled","disabled")//性别不可用
        $("#idcard").attr("disabled","disabled")   //身份证号不可用
        $("#phone").attr("disabled","disabled")   //手机号不可用
    }
    //不是会员
    function noVip() {
        $("#vip_num").attr("disabled","disabled") //会员卡号不可用
        $("#vip_num").removeAttr("lay-verify")  //移除表单验证
        $("#customerName").removeAttr("disabled")   //客人姓名可用
        $("input[name=gender]").removeAttr("disabled"); //性别可用
        $("#idcard").removeAttr("disabled")   //身份证号可用
        $("#phone").removeAttr("disabled")   //手机号可用
    }

    //根据条件查询数据条数(手机号)
    function loadVipCount(phone) {
        $.ajax({
            type:'POST',
            url:'vip/loadTCountByPramas',
            data:{"phone":phone},
            async:false,
            success:function (data) {
                if(data>0){
                    layer.tips('手机号不可用','#phone',{tips: [2,'red'],time:2000,tipsMore: true})
                    checkPhoneIf=false;
                }else {
                    layer.tips('手机号可用','#phone',{tips: [2,'green'],time:2000,tipsMore: true})
                    checkPhoneIf=true;
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
    //根据条件查询数据条数(身份证号)
    function loadVipIdCardCount(idcard) {
        $.ajax({
            type:'POST',
            url:'vip/loadTCountByPramas',
            data:{"idcard":idcard},
            async:false,
            success:function (data) {
                if(data>0){
                    layer.tips('身份证号不可用','#idcard',{tips: [2,'red'],time:2000,tipsMore: true})
                    checkIdcardIf=false;
                }else {
                    layer.tips('身份证号可用','#idcard',{tips: [2,'green'],time:2000,tipsMore: true})
                    checkIdcardIf=true;
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
})