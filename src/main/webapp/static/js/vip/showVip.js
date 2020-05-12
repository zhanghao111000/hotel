layui.use(['jquery','layer','table','form','laydate'],function  () {
    //新建内置模块对象
    var $ = layui.jquery,  //新建jquery对象
        layer = layui.layer,
        table = layui.table,
        form = layui.form,
        laydate = layui.laydate;
    var selJsonVip={};

    var checkPhoneIf=true;//手机号唯一性结果

    //初始化会员信息
    loadPageVip();

    function loadPageVip() {
        table.render({  //数据表格的数据渲染(此UI框架底层是进行异步加载)
            elem: '#demo'  //绑定容器  根据标签（数据容器）的id属性来
            ,height: 412   //容器高度
            //  ,width:1650  //容器宽度
            ,where:selJsonVip
            ,limit: 3  //每一页显示的数据条数，默认值为10
            ,limits:[2,3,5,8,10,15,20]   //进行每一页数据条数的选择
            ,url: 'vip/loadPageByPramas' //访问服务器端的数据接口(异步请求)，返回的json格式的数据
            ,even:true  //每一行有渐变效果
            ,page: true //开启分页,此时会自动的将当前页page和每一页数据条数limit的数值传回服务器端
            ,cols: [[ //表头
                {type:'checkbox'}
                ,{field: 'id', title: 'ID', align:'center', width:80, sort: true}
                ,{field: 'vipNum', title: '会员卡号', align:'center', width:220}
                ,{field: 'customerName', title: '客人姓名', align:'center', width:140, sort: true,edit: 'text'}
                ,{field: 'vipRate', title: '会员类型', align:'center', width:140,templet:'#vipRateTpl'}
                ,{field: 'gender', title: '性别', align:'center', width: 120,templet:'#genderTpl'}
                ,{field: 'idcard', title: '身份证号', align:'center', width: 220, sort: true}
                ,{field: 'phone', title: '手机号', align:'center', width: 220, sort: true}
                ,{field: 'createDate', title: '创建时间', align:'center', width: 220, sort: true}
                ,{fixed:'right', title: '操作', width:220, align:'center', toolbar: '#barDemo'}
            ]],
            done:function (res, curr, count) {  //执行分页是的函数回调；res为分页时服务器端的整个Map集合数据  curr为当前页  count为总的数据条数

            }
        });
    }
    //监听查询
    form.on('submit(demo1)', function(data){  //demo为按钮的lay-filter="demo1"属性中的值
        //console.log(data.field)
        selJsonVip=data.field
        loadPageVip();
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    //监听查看和修改会员信息
    table.on('tool(test)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）根据获取的值判断执行编辑或者删除操作
        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）
        if(layEvent === 'query'){ //查看
            layer.msg("查看了会员信息")
        } else if(layEvent === 'upd'){ //修改
            //1.数据回显
            $("#vip_id").val(data.id)//id
            $("#phone").val(data.phone)  //手机号
            if (data.vipRate=='0.8'){
                $("#vipRate").html('<option value="0.9">普通会员</option><option value="0.8" selected>超级会员</option>')
            } else {
                $("#vipRate").html('<option value="0.9" selected>普通会员</option><option value="0.8">超级会员</option>')
            }
            form.render('select')
            //2.弹出修改页面
            layer.open({
                type:1,  //弹出类型
                title:"会员修改界面",  //弹框标题
                area:['400px','280px'],  //弹框款高度
                anim: 5,  //弹出的动画效果
                shade:0.5,  //阴影遮罩
                content:$("#updVipDiv")  //弹出的内容
            });
            //服务执行修改
            form.on('submit(demo3)', function(data){  //demo为按钮的lay-filter="demo1"属性中的值
                updJsonVip=data.field
                updVip(updJsonVip,obj) //修改会员信息
                layer.closeAll();
                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            });
        }
        //手机号唯一性验证
        $("#phone").blur(function () {
            if (data.phone!=$(this).val()) {
                //向服务器发送请求根据条件查询数据条数
                loadVipCount($(this).val());
            }
        })
        //自定义表单验证(手机号唯一性)
        form.verify({
            //手机号唯一性验证
            checkPhone: function(value, item){ //value：表单的值、item：表单的DOM对象
                    if(!checkPhoneIf){
                        return '改手机号会员已存在！';
                    }
            }
        });
    });
    //监听单元格编辑（客人姓名）
    table.on('edit(test)', function(obj){ //test为table容器的lay-filter值
        var value = obj.value //得到修改后的值
            ,data = obj.data //得到所在行所有键值
            ,field = obj.field; //得到字段
        //layer.msg('id为：'+data.id+"字段为：" + field + ' 改为：'+ value);
        //服务器执行会员姓名的修改
        var updJsonVipCustomerName={};
        updJsonVipCustomerName['id']=data.id
        updJsonVipCustomerName['customerName']=value;
        updVipCustomerName(updJsonVipCustomerName);
    });

    //根据条件查询数据条数
    function loadVipCount(phone) {
        $.ajax({
            type:'POST',
            url:'vip/loadTCountByPramas',
            data:{"phone":phone},
            async:false,
            success:function (data) {
                if(data=='0'){
                  //  layer.tips('手机号可用','#vip_num',{tips: [2,'red'],time:2000})
                    checkPhoneIf=true;
                }else {
                   // layer.tips('手机号已存在','#vip_num',{tips: [2,'green'],time:2000})
                    checkPhoneIf=false;
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    //修改会员信息
    function  updVip(updJsonVip,obj) {
        $.ajax({
            type:'POST',
            url:'vip/updByPrimaryKeySelective',
            data:updJsonVip,
            success:function (data) {
                if(data=='success'){
                    layer.msg("修改成功。。。",{icon: 1,time:2000,anim: 4,shade:0.5});
                    //同步更新缓存对应的值
                    obj.update({
                        phone: updJsonVip.phone
                        ,vipRate: updJsonVip.vipRate
                    });
                }else {
                    layer.msg("修改失败！！！",{icon: 2,time:2000,anim: 3,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    //单元格修改会员姓名
    function  updVipCustomerName(updJsonVipCustomerName) {
        $.ajax({
            type:'POST',
            url:'vip/updByPrimaryKeySelective',
            data:updJsonVipCustomerName,
            success:function (data) {
                if(data=='success'){
                    layer.msg("修改成功。。。",{icon: 1,time:2000,anim: 4,shade:0.5});
                }else {
                    layer.msg("修改失败！！！",{icon: 2,time:2000,anim: 3,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
});