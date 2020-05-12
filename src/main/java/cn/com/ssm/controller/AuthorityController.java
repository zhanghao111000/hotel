package cn.com.ssm.controller;

import cn.com.ssm.entity.Authority;
import cn.com.ssm.entity.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/authority")
public class AuthorityController extends BaseController<Authority> {
    //查询登录用户拥有的一级和二级权限去到首页
    @RequestMapping("/toIndex")
    public String toIndex(HttpSession session, Model model){
        //取出登录的用户数据
        User loginUser = (User) session.getAttribute("loginUser");
        //查询出该登录的系统用户拥有的权限
        try {
            List<Map<String, Object>> dataList = authorityService.findAuthorityByRoleIdAndParent(loginUser);
            model.addAttribute("dataList",dataList);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "index";
    }

    //根据角色id查询角色拥有的一级和二级权限
    @RequestMapping("/loadAuthoritiesByRoleId")
    public @ResponseBody List<Authority> loadAuthoritiesByRoleId(Integer roleId) {
        try {
            return authorityService.findAuthoritiesByRoleId(roleId);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
