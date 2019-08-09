package com.example.gradleDemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class Application {
    //天气预报

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
