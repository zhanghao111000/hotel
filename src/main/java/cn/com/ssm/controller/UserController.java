package cn.com.ssm.controller;

import cn.com.ssm.entity.User;
import cn.com.ssm.utils.MD5;
import cn.com.ssm.utils.VerifyCodeUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Controller
@RequestMapping("/user")
public class UserController extends BaseController<User> {
    //获取验证码
    @RequestMapping("/getVerifyCode")
    public void getVerifyCode(HttpServletResponse response, HttpSession session){
        try {
            //取到随机验证码
            String verifyCode = VerifyCodeUtils.generateVerifyCode(4);
            //将验证码转为小写装入到session容器中
           session.setAttribute("verifyCode",verifyCode.toLowerCase());
            //将其写入页面
            VerifyCodeUtils.outputImage(200,35,response.getOutputStream(),verifyCode);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //验证码验证
    @RequestMapping("/checkVerifyCode")
    public @ResponseBody String checkVerifyCode(String yzm, HttpSession session){
        //获取产生的验证码
        String verifyCode = (String) session.getAttribute("verifyCode");
        //与输入的验证码进行比较
        if (yzm.toLowerCase().equals(verifyCode)){
            return "success";  //验证码正确
        }else {
            return "fail";//验证码错误
        }
    }

    //登录
    @RequestMapping("/login")
    public @ResponseBody String login(User user,HttpSession session){
        try {
            //进行MD5加密
            user.setPwd(MD5.md5crypt(user.getPwd()));
            //根据参数查询单个用户数据
            User loginUser = baseService.findOneByPramas(user);
            if (loginUser!=null){
                session.setAttribute("loginUser",loginUser);
                return "success";
            }else {
                return "fail";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    //退出平台
    @RequestMapping("/exitIndex")
    public @ResponseBody String exitIndex(HttpSession session){
        try {
            //移除登录的用户信息
            session.removeAttribute("loginUser");
            return "success";
        }catch (Exception e){
            e.printStackTrace();
            return "error";
        }
    }

    //添加用户
    @Override
    public String save(User user) {
        //进行md5加密
        user.setPwd(MD5.md5crypt(user.getPwd()));
        return super.save(user);
    }
}
