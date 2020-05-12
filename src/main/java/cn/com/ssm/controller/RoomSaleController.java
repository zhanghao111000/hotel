package cn.com.ssm.controller;

import cn.com.ssm.entity.RoomSale;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/roomSale")
public class RoomSaleController extends BaseController<RoomSale>{

    //房间销售记录分析
    @RequestMapping("/loadDbiRoomSale")
    public @ResponseBody Map<String,Object> loadDbiRoomSale(){
        try {
            return roomSaleService.findDbiRoomSale();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
