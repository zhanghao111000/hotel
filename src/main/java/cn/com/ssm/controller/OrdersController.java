package cn.com.ssm.controller;

import cn.com.ssm.entity.Orders;
import cn.com.ssm.service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/orders")
public class OrdersController extends BaseController<Orders> {

    /**
     * 支付成功后的操作
     * @param out_trade_no   订单标号
     * @return
     */
    @RequestMapping("/afterOrdersPay")
    public String afterOrdersPay(String out_trade_no){

        try {
            return ordersService.afterOrdersPay(out_trade_no);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
