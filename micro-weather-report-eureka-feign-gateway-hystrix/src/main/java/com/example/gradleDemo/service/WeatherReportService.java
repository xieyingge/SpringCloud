package com.example.gradleDemo.service;

import com.example.gradleDemo.entity.WeatherResponse;

public interface WeatherReportService {

    /**
     * 根据城市ID查询天气信息
     * @param cityId
     * @return
     */
    WeatherResponse getDataByCityId(String cityId);
}
