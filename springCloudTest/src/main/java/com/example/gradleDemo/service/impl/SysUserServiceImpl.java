package com.example.gradleDemo.service.impl;

import com.example.gradleDemo.dao.SysUserDao;
import com.example.gradleDemo.entity.SysUser;
import com.example.gradleDemo.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SysUserServiceImpl implements SysUserService {

    @Autowired
    private SysUserDao sysUserDao;

    @Override
    public List<SysUser> selectList() {
        return sysUserDao.selectList();
    }
}
