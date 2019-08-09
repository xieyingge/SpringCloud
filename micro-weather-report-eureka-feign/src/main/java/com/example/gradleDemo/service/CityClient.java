package com.example.gradleDemo.service;

import com.example.gradleDemo.entity.City;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient("micro-weather-city-eureka")
public interface CityClient {

    @GetMapping("/city/listCity")
    List<City> cityList();
}
