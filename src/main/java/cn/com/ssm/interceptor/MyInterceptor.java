package cn.com.ssm.interceptor;

import cn.com.ssm.entity.User;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 自定义拦截器
 */
public class MyInterceptor implements HandlerInterceptor {
    //拦截器的核心方法
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object o) throws Exception {
        User loginUser = (User) request.getSession().getAttribute("loginUser");
        if (loginUser!=null){//已登录
            return true; //放行
        }else {//未登录
            //装入拦截信息
            request.setAttribute("loginUIMsg","loginUIMsg");
            //转发到登录页面
            request.getRequestDispatcher("/model/loginUI").forward(request,response);
            return false;//拦截
        }

    }
    //拦截之前执行的方法
    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }
    //拦截之后执行的方法
    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}
