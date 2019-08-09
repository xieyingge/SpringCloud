package com.example.gradleDemo.service.impl;

import com.example.gradleDemo.entity.Weather;
import com.example.gradleDemo.entity.WeatherResponse;
import com.example.gradleDemo.service.WeatherDataService;
import com.example.gradleDemo.service.WeatherReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WeatherReportServiceImpl implements WeatherReportService {

    @Autowired
    private WeatherDataService weatherDataService;

    @Override
    public Weather getDataByCityId(String cityId) {
        WeatherResponse resp = weatherDataService.getDataByCityId(cityId);
        return resp.getData();
    }
}
