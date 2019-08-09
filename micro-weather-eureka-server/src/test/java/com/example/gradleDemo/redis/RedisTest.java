package com.example.gradleDemo.redis;


import com.example.gradleDemo.util.RedisUtil;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class RedisTest {
    @Autowired
    private RedisUtil redisUtil;


    @Test
    public void contextLoads() {
        try {
//            List<String> list = new ArrayList<>();
//            list.add("2333");
//            list.add("test1");
//            redisUtil.set("hello", list, 15);
//
//            System.out.println(redisUtil.getRedisTemplate().getConnectionFactory().getConnection());
//
//            List<String> result = redisUtil.get("hello", List.class, 15);
//            System.out.println(redisUtil.getRedisTemplate().getConnectionFactory().getConnection());
//            System.out.println(result);

//            System.out.println(redisUtil.incr(1, "hello", 1));
            redisUtil.deleteKeys(15, "hello");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
