layui.use(['jquery','layer','table','form','laydate'],function  () {
    //新建内置模块对象
    var $ = layui.jquery,  //新建jquery对象
        layer = layui.layer,
        table = layui.table,
        form = layui.form,
        laydate = layui.laydate;


    table.render({  //数据表格的数据渲染(此UI框架底层是进行异步加载)
        elem: '#demo'  //绑定容器  根据标签（数据容器）的id属性来
        ,height: 412   //容器高度
        ,limit: 3  //每一页显示的数据条数，默认值为10
        ,limits:[2,3,5,8,10,15,20]   //进行每一页数据条数的选择
        ,url: 'user/loadPageByPramas' //访问服务器端的数据接口(异步请求)，返回的json格式的数据
        ,even:true  //每一行有渐变效果
        ,page: true //开启分页,此时会自动的将当前页page和每一页数据条数limit的数值传回服务器端
        ,cols: [[ //表头
            {type:'checkbox'}
            ,{field: 'id', title: 'ID', align:'center', width:80, sort: true}
            ,{field: 'username', title: '用户名', align:'center', width:120}
            ,{field: 'pwd', title: '密码', align:'center', width:350, sort: true,edit: 'text'}
            ,{field: 'isAdmin', title: '用户角色', align:'center', width:120}
            ,{field: 'authorityNames', title: '用户权限', align:'center', width: 440,style:'color: #F581B1;'}
            ,{field: 'createDate', title: '创建时间', align:'center', width: 220}
            ,{field: 'useStatus', title: '是否可用', align:'center', width:120,templet:'#useStatusTpl'}
            ,{fixed:'right', title: '操作', width:200, align:'center', toolbar: '#barDemo'}
        ]],
        done:function (res, curr, count) {  //执行分页是的函数回调；res为分页时服务器端的整个Map集合数据  curr为当前页  count为总的数据条数

        }
    });
})