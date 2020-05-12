layui.use(['jquery','layer','table','form','laydate'],function  () {
    //新建内置模块对象
    //当有layui和zTree中均使用Jquery，则这里最好不要定义layui的Jquery对象
    //因为版本不同，不能混合使用
    var layer = layui.layer,
        table = layui.table,
        form = layui.form,
        laydate = layui.laydate;


    table.render({  //数据表格的数据渲染(此UI框架底层是进行异步加载)
        elem: '#demo'  //绑定容器  根据标签（数据容器）的id属性来
        ,height: 412   //容器高度
        ,limit: 2  //每一页显示的数据条数，默认值为10
        ,limits:[2,3,5,8,10,15,20]   //进行每一页数据条数的选择
        ,url: 'roles/loadPageByPramas' //访问服务器端的数据接口(异步请求)，返回的json格式的数据
        ,even:true  //每一行有渐变效果
        ,page: true //开启分页,此时会自动的将当前页page和每一页数据条数limit的数值传回服务器端
        ,cols: [[ //表头
            {type:'checkbox'}
            ,{field: 'id', title: 'ID', align:'center', width:140, sort: true}
            ,{field: 'roleName', title: '角色名称', align:'center', width:160}
            ,{field: 'authorityNames', title: '角色权限', align:'center', width:500, sort: true,edit: 'text',style:'color: #F581B1;'}
            ,{field: 'createDate', title: '创建时间', align:'center', width:260}
            ,{field: 'status', title: '是否可用', align:'center', width: 160,templet:'#statusTpl'}
            ,{field: 'flag', title: '是否显示', align:'center', width: 160,templet:'#flagTpl'}
            ,{fixed:'right', title: '操作', width:230, align:'center', toolbar: '#barDemo'}
        ]],
        done:function (res, curr, count) {  //执行分页是的函数回调；res为分页时服务器端的整个Map集合数据  curr为当前页  count为总的数据条数

        }
    });

    //监听工具条
    table.on('tool(test)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）根据获取的值判断执行编辑或者删除操作
        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）
        if(layEvent === 'query') { //点击查询
             //1.查询数据并渲染到树型结构容器中
            loadZtree('authority/loadAuthoritiesByRoleId?roleId='+data.id)
            //2.弹框显示
            layer.open({
                type: 1,  //弹框类型
                title: "权限的树型结构界面", //弹框标题
                area: ['400px', '500px'],  //弹框的宽高度
                anim: 4,  //弹框弹出时的动画效果
                shade: 0.5,  //背景的透明度
                content: $("#ztreeDiv"),  //弹出的内容
                cancel: function(index, layero){  //关闭弹框的回调函数
                    //将树型图的div重新隐藏起来
                    $("#ztreeDiv").hide();
                }
            });
        }
    })

    //根据角色加载角色的权限树形图
    function loadZtree(dataUrl) {
        var setting = {
            data : {
                simpleData : {
                    enable : true,   //使用格式化后的数据
                    idKey : "id",       // 结点的id,对应到Json数据中的节点对象的id
                    pIdKey : "parent",     // 结点的pId,父节点id,对应到Json数据中的节点对象的pid
                    // 最后跟实体对象中的id和pId名字一致
                    rootPId : 0         // 根节点设置为0，默认为0
                },
                key : {
                    name : "authorityName" // 结点显示的name属性，节点的名称，对应到Json中的authorityName
                }
            },
            check: {
                enable: true   //是否使用节点复选框，默认为false(不使用)
            },
            async : {
                enable : true,  //使用异步数据：从服务器端获取数据
                url:dataUrl,    //服务器端访问路径
                autoParam:["id", "name=n", "level=lv"],  //使用异步加载的默认配置
                otherParam:{"otherParam":"zTreeAsyncTest"}
            }
        };
        $.fn.zTree.init($("#test1"), setting);  //树形结构的数据初始化
    }
})