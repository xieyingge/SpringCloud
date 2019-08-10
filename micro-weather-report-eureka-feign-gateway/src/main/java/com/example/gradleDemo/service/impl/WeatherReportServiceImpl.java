package com.example.gradleDemo.service.impl;

import com.example.gradleDemo.entity.WeatherResponse;
import com.example.gradleDemo.service.DataClient;
import com.example.gradleDemo.service.WeatherReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WeatherReportServiceImpl implements WeatherReportService {


    @Autowired
    private DataClient dataClient;


    @Override
    public WeatherResponse getDataByCityId(String cityId) {


        return dataClient.getDataByCityId(cityId);
    }
}
