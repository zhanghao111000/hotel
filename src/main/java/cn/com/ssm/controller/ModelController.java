package cn.com.ssm.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/model")
public class ModelController {
   /* //去到平台首页
    @RequestMapping("/toIndex")
    public String toIndex(){
        return "index";
    }*/

    //去到入住信息显示页面
    @RequestMapping("/toShowInRoomInfo")
    public String toShowInRoomInfo(){
        return "InRoomInfo/showInRoomInfo";
    }

    //去到入住信息添加页面
    @RequestMapping("/toSaveInRoomInfo")
    public String toSaveInRoomInfo(){
        return "InRoomInfo/saveInRoomInfo";
    }

    //去到订单显示页面
    @RequestMapping("/toShowOrders")
    public String toShowOrders(){
        return "orders/showOrders";
    }

    //去到订单支付界面
    @RequestMapping("/toOrdersPay")
    public String toOrdersPay(){
        return "alipay/ordersPay";
    }

    //去到消费纪录显示页面
    @RequestMapping("/toShowRoomSale")
    public String toShowRoomSale(){
        return "roomSale/showRoomSale";
    }

    //去到会员信息显示页面
    @RequestMapping("/toShowVip")
    public String toShowVip(){
        return "vip/showVip";
    }

    //去到会员信息显示页面
    @RequestMapping("/toSaveVip")
    public String toSaveVip(){
        return "vip/saveVip";
    }

    //去到客房信息查询页面
    @RequestMapping("/toShowRooms")
    public String toShowRooms(){
        return "rooms/showRooms";
    }

    //去到房型显示页面
    @RequestMapping("/toShowRoomType")
    public String toShowRoomType(){
        return "roomType/showRoomType";
    }

    //去到登录页面
    @RequestMapping("/loginUI")
    public String loginUI(){
        return "login/login";
    }

    //去到角色信息显示页面
    @RequestMapping("/toShowRole")
    public String toShowRole(){
        return "role/showRole";
    }

    //去到系统用户显示页面
    @RequestMapping("/toShowUser")
    public String toShowUser(){
        return "user/showUser";
    }

    //去到系统用户添加页面
    @RequestMapping("/toSaveUser")
    public String toSaveUser(){
        return "user/saveUser";
    }

    //去到房间销售数据分卸页面
    @RequestMapping("/toShowIdd")
    public String toShowIdd(){
        return "dbi/showIdd";
    }
}
