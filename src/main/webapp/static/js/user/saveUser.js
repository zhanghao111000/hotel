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

    var checkUserNameIf=false;  //定义用户名唯一性的结果

    //初始化所有角色
    loadAllRoles();

    //用户名唯一性验证
    $("#username").blur(function () {
        var username=$(this).val()
        if (username.length >= 3 && username.length <= 12 && new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(username)
        &&!/(^\_)|(\__)|(\_+$)/.test(username)&&!/^\d+\d+\d$/.test(username)){
                checkUserName(username);
        }else {
            layer.tips('用户名格式错误','#username',{tips: [2,'red'],time:2000,tipsMore: true})
        }
    })

    //自定义表单验证
    form.verify({
        username: function(value, item){ //value：表单的值、item：表单的DOM对象
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
            if (!checkUserNameIf){
                return '该系统用户名已存在';
            }
        },
        pwd: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        pwd2:function (value,item) {
            if(value!=$("#pwd").val()){
                return  '两次输入的密码不一致'
            }
        }
    });

    //监听添加系统用户
    form.on('submit(demo2)', function(data){  //demo为按钮的lay-filter="demo1"属性中的值
         var saveJsonUser =data.field;
         var attrRoles=saveJsonUser.roles.split(',')
        delete saveJsonUser.roles
        saveJsonUser['roleId']=attrRoles[0]
        saveJsonUser['isAdmin']=attrRoles[1]
        saveJsonUser['useStatus']='1'
      //  console.log(saveJsonUser)
        //服务器执行添加
        saveUser(saveJsonUser);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    //加载所有角色数据
    function loadAllRoles(){
        $.ajax({
            type:'POST',
            url:'roles/loadAll',
            success:function (data) {
                var roleStr='<option value="">--请选择角色--</option>'
                $.each(data,function (i,role) {
                    roleStr +='<option value="'+role.id+','+role.roleName+'">'+role.roleName+'</option>'
                })
                $("#roleSel").html(roleStr)
                form.render('select')
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    //根据条件查询数据条数(用户名)
    function checkUserName(username) {
        $.ajax({
            type:'POST',
            url:'user/loadTCountByPramas',
            data:{"username":username},
            async:false,
            success:function (data) {
                if(data>0){
                    layer.tips('用户名不可用','#username',{tips: [2,'red'],time:2000,tipsMore: true})
                    checkUserNameIf=false;
                }else {
                    layer.tips('用户名可用','#username',{tips: [2,'green'],time:2000,tipsMore: true})
                    checkUserNameIf=true;
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    function saveUser(saveJsonUser) {
        $.ajax({
            type:'POST',
            url:'user/save',
            data:saveJsonUser,
            success:function (data) {
                if(data=='success'){
                    layer.msg("添加成功",{icon: 1,time:2000,anim: 4,shade:0.5});
                    //定时器，2s后跳转到系统用户信息显示页面
                    setTimeout('window.location="model/toShowUser"',2000);
                }else {
                    layer.msg("添加失败！！！",{icon: 2,time:2000,anim: 2,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
})