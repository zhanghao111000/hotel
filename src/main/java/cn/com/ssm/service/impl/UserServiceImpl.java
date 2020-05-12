package cn.com.ssm.service.impl;

import cn.com.ssm.entity.Authority;
import cn.com.ssm.entity.User;
import cn.com.ssm.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = false)
public class UserServiceImpl extends BaseServiceImpl<User> implements UserService {
    //重写根据条件分页查询
    @Override
    public Map<String, Object> findPageByPramas(Integer page, Integer limit, User user) throws Exception {
        //得到分页查询角色信息结果
        Map<String, Object> dataMap= super.findPageByPramas(page, limit, user);
        List<User> dataLists = (List<User>) dataMap.get("data");
        for (User dataList:dataLists){
            //根据系统用户表中角色id和parent=0查询出角色拥有的一级权限
            List<Authority> authorities = authorityMapper.selAuthorityByRoleIdAndParent(dataList.getRoleId(), 0);
            //获得系统用户拥有的所有的一级权限字符串  aaa,bbb，ccc
            StringBuffer sb=new StringBuffer();
            for (Authority authority:authorities){
                sb.append(authority.getAuthorityName()+",");
            }
            String authorityNames=sb.toString();
            dataList.setAuthorityNames(authorityNames.substring(0,authorityNames.length()-1));
        }
        return dataMap;
    }
}
