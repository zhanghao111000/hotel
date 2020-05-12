package cn.com.ssm.mapper;

import cn.com.ssm.entity.Authority;
import cn.com.ssm.entity.User;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

public interface AuthorityMapper extends BaseMapper<Authority> {
    //根据系统登录用户数据提供的角色id查询出权限id   根据权限id和字段parent查询出该用户的所有权限
    List<Authority> selAuthorityByRoleIdAndParent(@Param("roleId") Integer roleId ,@Param("parent") Integer parent)throws Exception;


   //根据角色id查询角色拥有的一级和二级权限
    //@Select 使用mybatis的注解方式查询 1.只能写一些简单没有动态条件的查询
    //2.不是Base系列中的基础查询，不能在base中写 用的很少 还是 xml为主
    //这种方式    返回实体封装类对象   属性名和表中字段名一致
    @Select("SELECT id,authority_name as authorityName,parent FROM authority WHERE id in (SELECT auth_id FROM role_auth WHERE role_id=#{roleId})")
    List<Authority> selAuthoritiesByRoleId(Integer roleId) throws Exception;
}