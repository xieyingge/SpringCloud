package com.example.gradleDemo.controller;


import com.example.gradleDemo.entity.SysUser;
import com.example.gradleDemo.service.impl.SysUserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/sysUser")
public class SysUserController {

    @Autowired
    private SysUserServiceImpl sysUserService;

    @RequestMapping("/index")
//    @ResponseBody
    public String index(Model model){
        List<SysUser> sysUsers = sysUserService.selectList();
        System.out.println(sysUsers);
        model.addAttribute("sysUsers", sysUsers);
        return "test";
    }




}
