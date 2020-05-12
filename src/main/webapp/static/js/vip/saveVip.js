layui.use(['jquery','layer','table','form','laydate'],function  () {
    //新建内置模块对象
    var $ = layui.jquery,  //新建jquery对象
        layer = layui.layer,
        table = layui.table,
        form = layui.form,
        laydate = layui.laydate;

    var checkIdcardIf=false; //身份证号的唯一的结果

    var checkPhoneIf=false;//手机号的唯一的结果

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

    //监听下拉框(会员类型)
    form.on('select(vipRate)', function(data){
       // console.log(data.value); //得到被选中的值
       var nowDateStr= getNowDate(new Date())
        $("#createDate").val(nowDateStr)
        if (data.value=='0.8'){
            $("#vipNum").val(dateReplace(nowDateStr)+'01')
        } else {
            $("#vipNum").val(dateReplace(nowDateStr)+'02')
        }
    });

    //监听添加
    form.on('submit(demo2)', function(data){  //demo为按钮的lay-filter="demo1"属性中的值
       // console.log(data.field)
        //服务器执行添加
        saveVip(data.field);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

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

    //添加会员信息
    function saveVip(saveJsonVip) {
        $.ajax({
            type:'POST',
            url:'vip/save',
            data:saveJsonVip,
            success:function (data) {
                if(data=='success'){
                    layer.msg("添加成功",{icon: 1,time:2000,anim: 4,shade:0.5});
                    //定时器，2s后跳转到会员信息显示页面
                    setTimeout('window.location="model/toShowVip"',2000);
                }else {
                    layer.msg("添加失败！！！",{icon: 2,time:2000,anim: 2,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
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

    //把 2019/01/01 12:12:12  -->  20190101121212
    function dateReplace(date) {
        date = date.replace("/","");
        date = date.replace("/","");
        date = date.replace(" ","");
        date = date.replace(":","");
        date = date.replace(":","");
        return date;
    }
})