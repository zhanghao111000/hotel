package cn.com.ssm.mapper;

import cn.com.ssm.entity.RoomSale;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

public interface RoomSaleMapper  extends BaseMapper<RoomSale> {
    @Select("SELECT room_num,SUM(sale_price) AS sumSalPrice  FROM roomsale GROUP BY room_num")
    List<Map<String,Object>> selDbiRoomSale()throws Exception;
}