package cn.com.ssm.service.impl;

import cn.com.ssm.entity.Authority;
import cn.com.ssm.entity.User;
import cn.com.ssm.service.AuthorityService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = false)
public class AuthorityServiceImpl extends BaseServiceImpl<Authority> implements AuthorityService {
    //根据系统登录用户数据提供的角色id查询出权限id   根据权限id和字段parent查询出该用户的所有权限
    @Override
    public List<Map<String, Object>> findAuthorityByRoleIdAndParent(User user) throws Exception {
        List<Map<String, Object>> dataList=new ArrayList<Map<String,Object>>();
        //查询出该登录用户的一级权限
        List<Authority> authorities = authorityMapper.selAuthorityByRoleIdAndParent(user.getRoleId(), 0);
        for (Authority authority:authorities) {
            Map<String,Object> dataMap=new HashMap<String, Object>();
            //dataMap中装入一级权限的Id和权限名
            dataMap.put("firstAuthorityId",authority.getId());
            dataMap.put("firstAuthorityName",authority.getAuthorityName());
            //根据权限ID和角色id查询出二级权限
            List<Authority> authorities1 = authorityMapper.selAuthorityByRoleIdAndParent(user.getRoleId(), authority.getId());
            //装入二级权限
            dataMap.put("secondAuthority",authorities1);
            dataList.add(dataMap);
        }
        return dataList;
    }

    //根据角色id查询角色拥有的一级和二级权限
    @Override
    public List<Authority> findAuthoritiesByRoleId(Integer roleId) throws Exception {
        return authorityMapper.selAuthoritiesByRoleId(roleId);
    }
}
