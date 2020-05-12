package cn.com.ssm.service.impl;

import cn.com.ssm.entity.InRoomInfo;
import cn.com.ssm.entity.Rooms;
import cn.com.ssm.service.InRoomInfoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = false)
public class InRoomInfoServiceImpl extends BaseServiceImpl<InRoomInfo> implements InRoomInfoService {
    @Override
    public String save(InRoomInfo inRoomInfo) throws Exception {
        //添加入住信息
        int saveInRoomInfoCount = baseMapper.insert(inRoomInfo);
        Rooms parRooms=new Rooms();
        parRooms.setId(inRoomInfo.getRoomId());
        parRooms.setRoomStatus("1");
        //修改房间状态  改为已入住
        int updRoomsRoomStatusCount = roomsMapper.updateByPrimaryKeySelective(parRooms);
        if (saveInRoomInfoCount>0&&updRoomsRoomStatusCount>0){
            return "success";
        }else {
            return "fail";
        }

    }
}
