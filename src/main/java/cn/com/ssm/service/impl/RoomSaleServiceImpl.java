package cn.com.ssm.service.impl;

import cn.com.ssm.entity.RoomSale;
import cn.com.ssm.service.RoomSaleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = false)
public class RoomSaleServiceImpl extends BaseServiceImpl<RoomSale> implements RoomSaleService {

    //房间销售记录分析
    @Override
    public Map<String, Object> findDbiRoomSale() throws Exception {
        List<Map<String, Object>> lists = roomSaleMapper.selDbiRoomSale();
        List<String> room_num=new ArrayList<String>();
        List<Double> sumSalPrice=new ArrayList<Double>();
        for (Map<String, Object> list:lists){
            room_num.add(list.get("room_num").toString());
            sumSalPrice.add((Double) list.get("sumSalPrice"));
        }
        Map<String,Object> jsonMap=new HashMap<String, Object>();
        jsonMap.put("xAxis",room_num);
        jsonMap.put("seriesData",sumSalPrice);
        return jsonMap;
    }
}
