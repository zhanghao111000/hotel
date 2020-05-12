package cn.com.ssm.service.impl;

import cn.com.ssm.entity.InRoomInfo;
import cn.com.ssm.entity.Orders;
import cn.com.ssm.entity.RoomSale;
import cn.com.ssm.entity.Rooms;
import cn.com.ssm.service.OrdersService;
import cn.com.ssm.utils.DateUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = false)
public class OrdersServiceImpl extends BaseServiceImpl<Orders> implements OrdersService {
    //退房添加订单
    @Override
    public String save(Orders orders) throws Exception {
        int saveOrdersCount = baseMapper.insert(orders);  //添加订单信息
        InRoomInfo parInRoomInfo=new InRoomInfo();
        parInRoomInfo.setId(orders.getIriId());
        parInRoomInfo.setOutRoomStatus("1");
        //修改入住信息   将未退房改为已退房
        int updOutRoomStatusCount = inRoomInfoMapper.updateByPrimaryKeySelective(parInRoomInfo);
        //查询房间id
        InRoomInfo inRoomInfo = inRoomInfoMapper.selectByPrimaryKey(orders.getIriId());
        Rooms parRooms=new Rooms();
        parRooms.setId(inRoomInfo.getRoomId());
        parRooms.setRoomStatus("2");
        //修改房屋状态 将已入住改为打扫状态
        int updRoomStatusCount = roomsMapper.updateByPrimaryKeySelective(parRooms);
        if (saveOrdersCount>0&&updOutRoomStatusCount>0&&updRoomStatusCount>0){
            return "success";
        }else {
            return "fail";
        }
    }
    /**
     * 支付成功后的操作
     * @param orderNum   订单标号
     * @return
     */
    @Override
    public String afterOrdersPay(String orderNum) throws Exception {
        //修改订单状态（将未结算0改为已结算1）
        //根据订单编号查询订单数据
        Orders parOrders=new Orders();
        parOrders.setOrderNum(orderNum);
        Orders orders = baseMapper.selectOneByPramas(parOrders);
        Orders parUpdOrderStatus =new Orders();
        parUpdOrderStatus.setId(orders.getId());
        parUpdOrderStatus.setOrderStatus("1");
        int updOrderStatusMsg = baseMapper.updateByPrimaryKeySelective(parUpdOrderStatus);
        //添加销售纪律
        RoomSale parRoomSale=new RoomSale();
        String[] attrOrderOther = orders.getOrderOther().split(",");// 客人信息
        String[] attrOrderPrice = orders.getOrderPrice().split(",");//各种金额
        parRoomSale.setRoomNum(attrOrderOther[0]);//房间号
        parRoomSale.setCustomerName(attrOrderOther[1]);//客人姓名
        parRoomSale.setStartDate(DateUtils.strToDate(attrOrderOther[2]));//入住时间
        parRoomSale.setEndDate(DateUtils.strToDate(attrOrderOther[3]));//退房时间
        parRoomSale.setDays(Integer.valueOf(attrOrderOther[4]));//天数
        parRoomSale.setRoomPrice(Double.valueOf(attrOrderPrice[0]));//房屋单价
        parRoomSale.setRentPrice(Double.valueOf(attrOrderPrice[2]));//实际住房费
        parRoomSale.setOtherPrice(Double.valueOf(attrOrderPrice[1]));//其它消费
        parRoomSale.setSalePrice(orders.getOrderMoney());//总金额
        //优惠金额=单价*天数-实际住房费
        parRoomSale.setDiscountPrice(parRoomSale.getRoomPrice()*parRoomSale.getDays()-parRoomSale.getRentPrice());
        int saveRoomSaleMsg = roomSaleMapper.insert(parRoomSale);
        if (updOrderStatusMsg>0&&saveRoomSaleMsg>0){
            return "redirect:/authority/toIndex";// 重定向去到平台首页
        }else {
            return "redirect:/model/errorPay";  //支付失败页面
        }

    }
}
