package cn.com.ssm.service.impl;

import cn.com.ssm.entity.Rooms;
import cn.com.ssm.service.RoomsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = false)
public class RoomsServiceImpl extends BaseServiceImpl<Rooms> implements RoomsService {
}
