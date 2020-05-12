package cn.com.ssm.service;

import cn.com.ssm.entity.RoomSale;

import java.util.List;
import java.util.Map;

public interface RoomSaleService extends BaseService<RoomSale> {

    //房间销售记录分析
   Map<String,Object> findDbiRoomSale()throws Exception;
}
