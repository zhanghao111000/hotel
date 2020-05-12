layui.use(['jquery','layer','element','form','laypage'],function  () {
    //新建内置模块对象
    var $ = layui.jquery,  //新建jquery对象
        layer = layui.layer,
        element = layui.element,
        form = layui.form,
        laypage = layui.laypage;  //分页组件

    var page=1;//当前页

    var limit=3;//每一页显示的数据条数

    var count;  //总的数据条数

    var checkRoomsOfRoomTypeIf=false //该房型下是否存在房间数据的结果

    var checkroomTypeNameIf=false//房名唯一性结果

    loadPageRoomType()//初始化首页房型数据

    loadPage();//初始化layui分页

    function loadPage(){
        laypage.render({
            elem: 'test1' //绑定分页容器
            ,count: count     //总的数据条数(重要)
            ,limit:limit  //每一页显示的数据条数
            ,limits:[3,5,10,15,20]  //总的数据条数，上一页 当前页 下一页 每一页显示的数据条数，重载，跳转到第几页
            ,layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
            ,jump: function(obj,first){  //执行分页的函数回调 每一次分页 执行的js（不会自上而下执行）
                //console.log(obj)
                //首次不执行
                if(!first){
                    limit=obj.limit;
                    page=obj.curr;
                    loadPageRoomType();
                }

            }
        });
    }


    //删除和修改
    $("#collapseDiv").on('click','button',function () {
        if ($(this).attr("event")=='del') {
            var roomTypeId=$(this).val()
           //房型数据存在房间信息则不能删除（根据房型id查询房间数据条数）
            checkRoomsOfRoomType(roomTypeId)
            if (checkRoomsOfRoomTypeIf) {
                layer.confirm('真的删除此房型吗？', function(index){
                    //向服务发送删除
                    delRoomTypeById(roomTypeId);
                    layer.close(index);  //关闭当前弹框
                });
            }else {
                layer.msg("该房型存在房间数据不可删除！！！",{icon: 7,time:2000,anim: 4,shade:0.5});
            }
        }else {
            var attrUpdBtnVal=$(this).val().split(',')
            //1.房型数据回显
            form.val("updRoomTypeFromFilter", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                "id":attrUpdBtnVal[0]
                ,"roomTypeName":attrUpdBtnVal[1] // "name": "value"
                ,"roomPrice": attrUpdBtnVal[2]
            });
            //2.弹出修改页面
            layer.open({
                type:1,  //弹出类型
                title:"房型修改界面",  //弹框标题
                area:['430px','280px'],  //弹框款高度
                anim: 4,  //弹出的动画效果
                shade:0.5,  //阴影遮罩
                content:$("#updRoomTypeDiv")  //弹出的内容
            });
            //3.服务器执行修改
            //监听修改
            form.on('submit(demo4)', function(data){  //demo为按钮的lay-filter="demo1"属性中的值
                // console.log(data.field)
                //服务器执行修改
                updRoomType(data.field);
                layer.closeAll();
                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            });
        }
    })

    //自定义的修改的房型加个验证
    form.verify({
        //房间单价
        roomPrice: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(value<100||value>2000){
                return '房间的单价在100到2000之间！';
            }
        },
        //房型名唯一性验证
        roomTypeName: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(!checkroomTypeNameIf){
                return '该房型名已存在！';
            }
        },
    });
    //添加房型数据
    $("#saveRoomTypeBtn").click(function () {
        //1.清空添加的表单
        $("#saveRoomTypeDiv form").eq(0).find('input').val('')
        //2.弹出添加页面
        layer.open({
            type:1,  //弹出类型
            title:"房型添加界面",  //弹框标题
            area:['430px','280px'],  //弹框款高度
            anim: 4,  //弹出的动画效果
            shade:0.5,  //阴影遮罩
            content:$("#saveRoomTypeDiv")  //弹出的内容
        });
        //3.执行添加
        form.on('submit(demo3)', function(data){  //demo为按钮的lay-filter="demo1"属性中的值
            // console.log(data.field)
            //服务器执行房间类型数据添加
            saveRoomType(data.field);
            layer.closeAll();
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    })
    //房名唯一性验证
    $("#roomTypeName").blur(function () {
        if ($(this).val()!=''){
            checkroomTypeName($(this).val());
        }
    })
    //监听折叠
    element.on('collapse(test)', function(data){
        //layer.msg('展开状态：'+ data.show);
        if (data.show){
            //根据房型id查询房间数据
           // layer.msg($(this).attr('roomTypeId'))
            loadRoomsByRoomTypeId($(this).attr('roomTypeId'))
        }
    });

    //加载第1页的房型数据，要得到总的数据条数（重要）
    function loadPageRoomType() {
        $.ajax({
            type:"post",
            url:"roomType/loadPageByPramas",
            async: false,
            data:{"page":page,"limit":limit},
            success:function (data) {
                count = data.count;  //将数据总的条数赋值给全局变量
                var roomTypeStr = '';
                $.each(data.data,function (i,roomType) {
                    roomTypeStr += '<div class="layui-colla-item" style="margin-top: 10px;">';
                    roomTypeStr += '<button type="button" class="layui-btn layui-btn-sm layui-btn-danger" event="del" value="'+roomType.id+'" style="float: right;">删除</button>';
                    roomTypeStr += '<button type="button" class="layui-btn layui-btn-sm layui-btn-warm" event="upd" value="'+roomType.id+','+roomType.roomTypeName+','+roomType.roomPrice+'" style="float: right;">修改</button>';
                    roomTypeStr += '<h2 class="layui-colla-title" roomTypeId="'+roomType.id+'">'+roomType.roomTypeName+'--'+roomType.roomPrice+'元/天'+'</h2>';
                    roomTypeStr += '<div class="layui-colla-content">';
                    roomTypeStr += '<p id="p'+roomType.id+'"></p>';
                    roomTypeStr += '</div>';
                    roomTypeStr += '</div>';
                })
                $("#collapseDiv").html(roomTypeStr);
                //将面板渲染
                element.render('collapse');
            },
            error:function (data) {
                layer.msg("服务器异常",{icon: 3,time: 2000,anim:4,shade:0.5})
            }
        });
    }

    //房型数据存在房间信息则不能删除（根据房型id查询房间数据条数）
    function checkRoomsOfRoomType(roomTypeId){
        $.ajax({
            type:'POST',
            url:'rooms/loadTCountByPramas',
            data:{"roomTypeId":roomTypeId},
            async:false,
            success:function (data) {
                if(data>0){
                   // layer.tips('手机号不可用','#phone',{tips: [2,'red'],time:2000,tipsMore: true})
                    checkRoomsOfRoomTypeIf=false;
                }else {
                   // layer.tips('手机号可用','#phone',{tips: [2,'green'],time:2000,tipsMore: true})
                    checkRoomsOfRoomTypeIf=true;
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
    //根据id删除房型
    function delRoomTypeById(id) {
        $.ajax({
            type:'POST',
            url:'roomType/delByPrimaryKey',
            data:{"id":id},
            success:function (data) {
                if(data=='success'){
                    loadPageRoomType() //重新加载当前页数据
                    loadPage()//重新加载总的数据条数，总的数据条数会发生变化
                    layer.msg("删除成功。。。",{icon: 1,time:2000,anim: 4,shade:0.5});
                }else {
                    layer.msg("删除失败！！！",{icon: 2,time:2000,anim: 3,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
    //房型数据修改
    function updRoomType(updJsonRoomType) {
        $.ajax({
            type:'POST',
            url:'roomType/updByPrimaryKeySelective',
            data:updJsonRoomType,
            success:function (data) {
                if(data=='success'){
                    loadPageRoomType() //重新加载当前页数据
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
    //
    function checkroomTypeName(roomTypeName) {
        $.ajax({
            type:'POST',
            url:'roomType/loadTCountByPramas',
            data:{"roomTypeName":roomTypeName},
            async:false,
            success:function (data) {
                if(data>0){
                    layer.tips('房型名不可用','#roomTypeName',{tips: [2,'red'],time:2000,tipsMore: true})
                    checkroomTypeNameIf=false;
                }else {
                    layer.tips('房型名可用','#roomTypeName',{tips: [2,'green'],time:2000,tipsMore: true})
                    checkroomTypeNameIf=true;
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
    //服务器执行房间类型数据添加
    function saveRoomType(saveJsonRoomType) {
        $.ajax({
            type:'POST',
            url:'roomType/save',
            data:saveJsonRoomType,
            success:function (data) {
                if(data=='success'){
                    page=1
                    loadPageRoomType() //重新加载第一页数据
                    loadPage()//重新加载总的数据条数，总的数据条数会发生变化
                    layer.msg("添加成功。。。",{icon: 1,time:2000,anim: 4,shade:0.5});
                }else {
                    layer.msg("添加失败！！！",{icon: 2,time:2000,anim: 3,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
    //根据房型id查询房间数据
    function  loadRoomsByRoomTypeId(roomTypeId){
        $.ajax({
            type:'POST',
            url:'rooms/loadManyByPramas',
            data:{"roomTypeId":roomTypeId},
            success:function (data) {
                var roomStatus1='<ul class="site-doc-icon site-doc-anim">'
                if(data!=''){
                    $.each(data,function (i,item) {
                        if(item.roomStatus=='0'){
                            roomStatus1 += '<li style="background-color: #009688;">';
                        }else if(item.roomStatus=='1'){
                            roomStatus1 += '<li style="background-color: red;">';
                        }else {
                            roomStatus1 += '<li style="background-color: blueviolet;">';
                        }
                        roomStatus1 += '<img class="layui-anim" id="demo1" src="'+item.roomPic+'" width="135px" height="135px"/>';
                        roomStatus1 += '<div class="code">';
                        roomStatus1 += '<span style="display: block;color: #0C0C0C;">'+item.roomNum+'-'+item.roomType.roomTypeName+'-'+item.roomType.roomPrice+'元/天</span>';
                        roomStatus1 += '</div>';
                        roomStatus1 += '</li>';
                    })
                    roomStatus1+='</ul>'
                    $("#p"+roomTypeId).html(roomStatus1)
                }else {
                    layer.msg("此房型下没房间！！！",{icon: 3,time:2000,anim: 3,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
})