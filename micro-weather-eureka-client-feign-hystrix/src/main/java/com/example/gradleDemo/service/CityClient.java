package com.example.gradleDemo.service;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient("micro-weather-city-eureka")
public interface CityClient {

    @GetMapping("/city/listCity")
    String listCity();
}
