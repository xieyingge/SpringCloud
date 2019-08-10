package com.example.gradleDemo;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ConfigClientTest {

    @Value("${springcloud}")
    private String springcloud;

    @Test
    public void contextLoads() {
        System.out.println("fdsafdsafdsafdsaf**************:  " + springcloud);

        assertEquals("foo.foo.foo", springcloud);
    }
}
