layui.use(['jquery','layer','table','form','laydate','upload'],function  () {
    //新建内置模块对象
    var $ = layui.jquery,  //新建jquery对象
        layer = layui.layer,
        table = layui.table,
        form = layui.form,
        laydate = layui.laydate,
        upload = layui.upload;

    loadAllRooms();//初始化所有房间信息

    loadAllRoomType();//初始化所有房间类型

    var checkRoomNumIf=false;//房间号唯一的结果

    var arrUl = $("#LAY_preview").find("ul");  //房屋显示的ul容器数组

    //加载所有房间信息
    function loadAllRooms() {
        $.ajax({
            type:'POST',
            url:'rooms/loadAll',
           // data:saveJsonVip,
            success:function (data) {
                var roomStatus0='';
                var roomStatus1='';
                var roomStatus2='';
                $.each(data,function (i,item) {
                    if(item.roomStatus=='0'){
                        roomStatus0 += '<li style="background-color: #009688;">';
                        roomStatus0 += '<img class="layui-anim" id="demo1" src="'+item.roomPic+'" width="135px" height="135px"/>';
                        roomStatus0 += '<div class="code">';
                        roomStatus0 += '<span style="display: block;color: #0C0C0C;">'+item.roomNum+'-'+item.roomType.roomTypeName+'-'+item.roomType.roomPrice+'元/天</span>';
                        roomStatus0 += '<button type="button" value="del" roomid="'+item.id+'" class="layui-btn layui-btn-danger layui-btn-xs">删除</button>';
                        roomStatus0 += '</div>';
                        roomStatus0 += '</li>';
                    }else if(item.roomStatus=='1'){
                        roomStatus1 += '<li style="background-color: red;">';
                        roomStatus1 += '<img class="layui-anim" id="demo1" src="'+item.roomPic+'" width="135px" height="135px"/>';
                        roomStatus1 += '<div class="code">';
                        roomStatus1 += '<span style="display: block;color: #0C0C0C;">'+item.roomNum+'-'+item.roomType.roomTypeName+'-'+item.roomType.roomPrice+'元/天</span>';
                        roomStatus1 += '</div>';
                        roomStatus1 += '</li>';
                    }else {
                        roomStatus2 += '<li style="background-color: blueviolet;">';
                        roomStatus2 += '<img class="layui-anim" id="demo1" src="'+item.roomPic+'" width="135px" height="135px"/>';
                        roomStatus2 += '<div class="code">';
                        roomStatus2 += '<span style="display: block;color: #0C0C0C;">'+item.roomNum+'-'+item.roomType.roomTypeName+'-'+item.roomType.roomPrice+'元/天</span>';
                        roomStatus2 += '<button type="button" value="del" roomid="'+item.id+'" class="layui-btn layui-btn-danger layui-btn-xs">删除</button>';
                        roomStatus2 += '<button type="button" value="upd" roomid="'+item.id+'" class="layui-btn layui-btn-xs layui-btn-normal">空闲</button>';
                        roomStatus2 += '</div>';
                        roomStatus2 += '</li>';
                    }
                })
                arrUl.eq(0).html(roomStatus0)
                arrUl.eq(1).html(roomStatus1)
                arrUl.eq(2).html(roomStatus2)
                hoverOpenImg()//图片放大镜
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
    //删除空闲的房间（修改房间显示的状态1-0）
    $('ul').eq(0).on('click','button',function () {
       // console.log($(this).attr('roomid'))
        var roomId=$(this).attr('roomid')
        layer.confirm('真的删除此房间吗？', function(index){
            //服务器执行删除修改房间显示的状态1-0）
            updRoomsFlag(roomId);
            layer.close(index);  //关闭当前弹框
        })
    })
    //删除和修改打扫的房间（删除修改房间显示的状态1-0）
    $('ul').eq(2).on('click','button',function () {
        // console.log($(this).attr('roomid'))
        var roomId=$(this).attr('roomid')
        var butVal=$(this).val()
        if (butVal=='del') {//删除打扫的房间
            layer.confirm('真的删除此房间吗？', function(index){
                //服务器执行删除修改房间显示的状态1-0）
                updRoomsFlag(roomId);
                layer.close(index);  //关闭当前弹框
            })
        }else {  //修改打扫的房间
            layer.confirm('真的将此房间改为空闲吗？', function(index){
                //服务器执行修改（将打扫状态改为空闲状态）
                updRoomStatus(roomId);
                layer.close(index);  //关闭当前弹框
            })
        }

    })
    //添加房间
   $("#saveRoomsUI").click(function () {
       //1.清空添加页面
        $("form").eq(0).find('input').val('')
       //回显图片
       $("#demo1").attr('src', "http://q7dht7db5.bkt.clouddn.com/fm1.jpg")
       $("#roomPicId").val("http://q7dht7db5.bkt.clouddn.com/fm1.jpg")
       //2弹出添加页面
       layer.open({
           type:1,  //弹出类型
           title:"房间添加界面",  //弹框标题
           area:['480px','500px'],  //弹框款高度
           anim: 4,  //弹出的动画效果
           shade:0.5,  //阴影遮罩
           content:$("#saveRoomsDiv")  //弹出的内容
       });
   })

    //监听添加房间
    form.on('submit(demo3)', function(data){  //demo为按钮的lay-filter="demo1"属性中的值
       // console.log(data.field)
        var saveJsonRoom=data.field
        saveJsonRoom['roomStatus']='0'
        saveJsonRoom['flag']=1
        //服务器执行添加
       saveRooms(saveJsonRoom);
        layer.closeAll();
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    $("#roomNum").blur(function () {
        //根据条件查询房间数据条数
        loadTCountByPramas($(this).val())
    })

    //自定义表单验证
    form.verify({
        //房间号验证
        checkRoomNum: function(value, item){ //value：表单的值、item：表单的DOM对象
            if (value.length<4||value.length>5){
                return '房间号长度为4或5'
            }
            if (!checkRoomNumIf){
                return '该房间号已存在';
            }
        }
    });

    //上传图片
    var uploadInst = upload.render({
        elem: '#test1'//绑定元素
        ,url: 'rooms/fileUpload' //改成您自己的上传接口
        ,field:"myFile"//文件域中的文件的名字
       /* ,data:{"path":"E:\\JAVA北大青鸟\\U3\\layweb\\img"}  //上传的目标文件夹路径*/
       /* ,auto:false  //是否选完文件后自动上传
        ,bindAction: '#test9'  //绑定手动开始上传
        ,size:'5120' //文件上传的最大 单位KB
        ,accept:'file'  //允许上传的文件类型*/
        ,before: function(obj){
            //预读本地文件示例，不支持ie8
            obj.preview(function(index, file, result){
                $('#demo1').attr('src', result); //图片链接（base64）
            });
        }
        ,done: function(res){//上传完毕回调
            //如果上传失败
            if(res.code == 0){
                layer.msg('上传成功');
                $("#roomPicId").val(res.newFileName)
            }else {
                layer.msg("上传失败")
            }

        }
        ,error: function(){ //请求异常回调
            //演示失败状态，并实现重传
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function(){
                uploadInst.upload();
            });
        }
    });

    //图片放大镜
    function hoverOpenImg(){
        var img_show = null; // tips提示
        $('img').hover(function(){
            var img = "<img class='img_msg' src='"+$(this).attr('src')+"' style='width:580px;' />";
            img_show = layer.tips(img, this,{
                tips:[2, 'rgba(41,41,41,.5)']
                ,area: ['600px']
                ,time: -1  //永久显示
                ,anim: 3
            });
        },function(){
            layer.close(img_show);
        });
        $('img').attr('style','max-width:270px');
    }
    //删除房间（修改房间的显示状态）
    function updRoomsFlag(id) {
        $.ajax({
            type:'POST',
            url:'rooms/updByPrimaryKeySelective',
            data:{"id":id,"flag":0},
            success:function (data) {
                if(data=='success'){
                    loadAllRooms();//重新加载所有房屋信息
                    layer.msg("删除成功。。。",{icon: 1,time:2000,anim: 4,shade:0.5});
                }else {
                    layer.msg("删除失败！！！",{icon: 2,time:2000,anim: 2,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    //服务器执行修改（将打扫状态改为空闲状态）
    function updRoomStatus(roomId) {
        $.ajax({
            type:'POST',
            url:'rooms/updByPrimaryKeySelective',
            data:{"id":roomId,"roomStatus":'0'},
            success:function (data) {
                if(data=='success'){
                    loadAllRooms();//重新加载所有房屋信息
                    layer.msg("修改成功。。。",{icon: 1,time:2000,anim: 4,shade:0.5});
                }else {
                    layer.msg("修改失败！！！",{icon: 2,time:2000,anim: 2,shade:0.5});
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }

    //加载所有房间类型
    function loadAllRoomType() {
        $.ajax({
            type:'POST',
            url:'roomType/loadAll',
            //data:{"id":roomId,"roomStatus":'0'},
            success:function (data) {
                var roomTypeStr='<option value="">请选择房间类型</option>'
              $.each(data,function (i,item) {
                  roomTypeStr +='<option value="'+item.id+'">'+item.roomTypeName+'-'+item.roomPrice+'</option>'
              })
                $("#selRoomType").html(roomTypeStr)
                form.render('select')
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
    //根据条件查询房间数据条数
    function loadTCountByPramas(roomNum){
        $.ajax({
            type:'POST',
            url:'rooms/loadTCountByPramas',
            data:{"roomNum":roomNum},
            async:false,
            success:function (data) {
                if(data>0){
                    layer.tips('房间号不可用','#roomNum',{tips: [2,'red'],time:2000,tipsMore: true})
                    checkRoomNumIf=false;
                }else {
                    layer.tips('房间号可用','#roomNum',{tips: [2,'green'],time:2000,tipsMore: true})
                    checkRoomNumIf=true;
                }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
    //添加房间
    function saveRooms(saveJsonRoom) {
        $.ajax({
            type:'POST',
            url:'rooms/save',
            data:saveJsonRoom,
            success:function (data) {
               if (data=='success'){
                   loadAllRooms();
                   layer.msg("添加成功。。。",{icon: 1,time:2000,anim: 4,shade:0.5});
               } else {
                   layer.msg("添加失败！！！",{icon: 2,time:2000,anim: 3,shade:0.5});
               }
            },
            error:function () {
                layer.msg("服务器异常！！！",{icon: 7,time:2000,anim: 6,shade:0.5});
            }
        });
    }
})