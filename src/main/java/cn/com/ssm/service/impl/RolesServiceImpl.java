package cn.com.ssm.service.impl;

import cn.com.ssm.entity.Authority;
import cn.com.ssm.entity.Roles;
import cn.com.ssm.service.RolesService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = false)
public class RolesServiceImpl extends BaseServiceImpl<Roles> implements RolesService {

    //重写根据条件分页查询
    @Override
    public Map<String, Object> findPageByPramas(Integer page, Integer limit, Roles roles) throws Exception {
        //得到分页查询角色信息结果
        Map<String, Object> dataMap= super.findPageByPramas(page, limit, roles);
        List<Roles> dataLists = (List<Roles>) dataMap.get("data");
        for (Roles dataList:dataLists){
            //根据角色id和parent=0查询出角色拥有的一级权限
            List<Authority> authorities = authorityMapper.selAuthorityByRoleIdAndParent(dataList.getId(), 0);
            //获得角色拥有的所有的一级权限字符串  aaa,bbb，ccc
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
