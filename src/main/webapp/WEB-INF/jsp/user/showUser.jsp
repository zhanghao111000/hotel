<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<!--http://localhost:8080/-->
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<head>
    <!--引用基础路径-->
    <base href="<%=basePath%>"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>标题</title>
    <!--引入layui的样式文件-->
    <link rel="stylesheet" href="static/lib/layui/css/layui.css">
    <style type="text/css">
        .layui-table td{
            height: 60px;
        }
    </style>
    <!--引入layui的js文件-->
    <script src="static/lib/layui/layui.js"></script>
</head>
<body>
    <div>
        <fieldset class="layui-elem-field layui-field-title" style="margin-top: 20px;">
            <legend>用户信息显示</legend>
        </fieldset>
        <div align="center">
            <!--订单信息数据显示的容器-->
            <table id="demo" lay-filter="test"></table>
        </div>
    </div>
</body>
<!--引入layui的js文件-->
<script src="static/js/user/showUser.js"></script>
<!--表格操作模板-->
<script type="text/html" id="barDemo">
    <a class="layui-btn layui-btn-xs" lay-event="query"><i class="layui-icon">&#xe615;</i>查看</a>
</script>

<!--是否可用-->
<script type="text/html" id="useStatusTpl">
    {{#  if(d.useStatus == 1){ }}
    <font color="green">可用</font>
    {{#  } else { }}
    <font color="red">不可用</font>
    {{#  } }}
</script>
</html>