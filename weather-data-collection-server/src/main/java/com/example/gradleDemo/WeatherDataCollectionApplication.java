package com.example.gradleDemo;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.gradleDemo.dao")
//@ServletComponentScan
public class WeatherDataCollectionApplication {
    //天气预报

    public static void main(String[] args) {
        SpringApplication.run(WeatherDataCollectionApplication.class, args);
    }

}
