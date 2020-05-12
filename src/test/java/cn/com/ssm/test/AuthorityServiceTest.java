package cn.com.ssm.test;

import cn.com.ssm.entity.Authority;
import cn.com.ssm.entity.InRoomInfo;
import cn.com.ssm.entity.User;
import cn.com.ssm.service.AuthorityService;
import cn.com.ssm.service.InRoomInfoService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.List;
import java.util.Map;

public class AuthorityServiceTest {
    //创建日志对象
    private final static Logger log = LogManager.getLogger(AuthorityServiceTest.class);

    //定义applicationContext对象
    private ApplicationContext applicationContext;

    //定义员工Mapper代理对象
    private AuthorityService authorityService;

    @Before
    public void before(){
        //测试之前读取spring-config.xml文件
        applicationContext = new ClassPathXmlApplicationContext("spring-main.xml");
        //获取员工业务层对象
        authorityService = applicationContext.getBean("authorityServiceImpl", AuthorityService.class);
    }

    //测试分页查询
    @Test
    public void test01(){
        User user=new User();
        user.setRoleId(1);
        try {
            List<Map<String, Object>> dataLists = authorityService.findAuthorityByRoleIdAndParent(user);
            for (Map<String, Object> dataList:dataLists){
                log.info("----------一级权限------------");
                log.info(dataList.get("firstAuthorityId"));
                log.info(dataList.get("firstAuthorityName"));
                log.info("----------二级权限------------");
                List<Authority> secondAuthority = (List<Authority>) dataList.get("secondAuthority");
                for (Authority authority:secondAuthority){
                    log.info(authority);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
