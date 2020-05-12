package cn.com.ssm.service;

import cn.com.ssm.entity.Orders;
import org.springframework.web.bind.annotation.RequestMapping;

public interface OrdersService extends BaseService<Orders> {
    /**
     * 支付成功后的操作
     * @param orderNum   订单标号
     * @return
     */
     String afterOrdersPay(String orderNum)throws Exception;

}
