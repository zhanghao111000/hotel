layui.use(['jquery','layer','table','form','laydate'],function  () {
    //新建内置模块对象
    var $ = layui.jquery,  //新建jquery对象
        layer = layui.layer,
        table = layui.table,
        form = layui.form,
        laydate = layui.laydate;

    var checkVerifyCodeIf=false;//验证码验证结果

    //是否登录的拦截器
    if ($("#loginUIMsg").val()=='loginUIMsg') {
        layer.msg("对不起，你还未登录！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
    }

    //验证码验证
    $("#yzm").blur(function () {
        var yzmInput=$(this).val()
        if (yzmInput.length==4){
            checkVerifyCode(yzmInput)
        }else {
            layer.tips('验证码长度为4','#yzm',{tips: [2,'red'],time:2000,tipsMore: true})
        }
    })

    //自定义表单验证
    form.verify({
        userName: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                return '用户名不能有特殊字符';
            }
            if(/(^\_)|(\__)|(\_+$)/.test(value)){
                return '用户名首尾不能出现下划线\'_\'';
            }
            if(/^\d+\d+\d$/.test(value)){
                return '用户名不能全为数字';
            }
            if (value.length<3||value>12){
                return  '用户名长度在3到12位';
            }
        },
        pwd: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        yzm:function (value,item) {
            if(value.length!=4){
                return  '验证码长度为4'
            }else {
                if (!checkVerifyCodeIf) {
                    return  '验证码错误！'
                }
            }
        }
    });

    //监听登录提交（进行登录）
    form.on('submit(login)', function(data){  //demo为按钮的lay-filter="demo1"属性中的值
        //console.log(data.field)
        //服务器登录
        login(data.field);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    //验证码验证
    function checkVerifyCode(yzm) {
        $.ajax({
            type:'POST',
            url:'user/checkVerifyCode',
            data:{"yzm":yzm},
            async:false,
            success:function (data) {
                if(data=='success'){
                    layer.tips('验证码正确','#yzm',{tips: [2,'green'],time:2000,tipsMore: true})
                    checkVerifyCodeIf=true;
                }else {
                    layer.tips('验证码错误','#yzm',{tips: [2,'red'],time:2000,tipsMore: true})
                    checkVerifyCodeIf=false;
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    //登录
    function login(loginJsonUser) {
        $.ajax({
            type:'POST',
            url:'user/login',
            data:loginJsonUser,
            success:function (data) {
                if(data=='success'){
                    layer.msg("登录成功。。。",{icon: 1,time:2000,anim: 4,shade:0.5});
                    //定时器，2s后跳转平台首页，并且查询权限菜单数据
                    setTimeout('window.location="authority/toIndex"',2000);
                }else {
                    layer.msg("登录失败！！！",{icon: 2,time:2000,anim: 3,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
})