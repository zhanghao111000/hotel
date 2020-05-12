package cn.com.ssm.service;

import cn.com.ssm.entity.Authority;
import cn.com.ssm.entity.User;

import java.util.List;
import java.util.Map;

public interface AuthorityService  extends BaseService<Authority>{

    //根据系统登录用户数据提供的角色id查询出权限id   根据权限id和字段parent查询出该用户的所有权限
    List<Map<String,Object>> findAuthorityByRoleIdAndParent(User user)throws Exception;

    //根据角色id查询角色拥有的一级和二级权限
    List<Authority> findAuthoritiesByRoleId(Integer roleId)throws Exception;
}
