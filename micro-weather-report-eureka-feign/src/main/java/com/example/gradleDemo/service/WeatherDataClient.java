package com.example.gradleDemo.service;

import com.example.gradleDemo.entity.WeatherResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("micro-weather-data-eureka")
public interface WeatherDataClient {

    @GetMapping("/weather/cityId/{cityId}")
    WeatherResponse getDataByCityId(@PathVariable("cityId") String cityId);

}
