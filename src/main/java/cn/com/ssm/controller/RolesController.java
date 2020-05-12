package cn.com.ssm.controller;

import cn.com.ssm.entity.Roles;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/roles")
public class RolesController extends BaseController<Roles> {
}
