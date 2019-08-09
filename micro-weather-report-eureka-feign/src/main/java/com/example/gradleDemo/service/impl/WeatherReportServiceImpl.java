package com.example.gradleDemo.service.impl;

import com.example.gradleDemo.entity.WeatherResponse;
import com.example.gradleDemo.service.WeatherDataClient;
import com.example.gradleDemo.service.WeatherReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WeatherReportServiceImpl implements WeatherReportService {


    @Autowired
    private WeatherDataClient weatherDataClient;


    @Override
    public WeatherResponse getDataByCityId(String cityId) {


        return weatherDataClient.getDataByCityId(cityId);
    }
}
