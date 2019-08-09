package com.example.gradleDemo.job;

import com.example.gradleDemo.entity.City;
import com.example.gradleDemo.service.CityClient;
import com.example.gradleDemo.service.WeatherDataCollectionService;
import lombok.extern.slf4j.Slf4j;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;

import java.util.List;

@Slf4j
public class WeatherDataSyncJob extends QuartzJobBean {

    @Autowired
    private WeatherDataCollectionService weatherDataCollectionService;

    @Autowired
    private CityClient cityClient;

    @Override
    protected void executeInternal(JobExecutionContext context) throws JobExecutionException {
        log.info("Weather Data Sync Job. Start！");
        // 获取城市ID列表
        List<City> cityList = null;
        try {

            cityList = cityClient.cityList();

        } catch (Exception e) {
            log.error("Exception!", e);
        }

        // 遍历城市ID获取天气
        for (City city : cityList) {
            String cityId = city.getCityId();
            log.info("Weather Data Sync Job, cityId:" + cityId);

            weatherDataCollectionService.syncDateByCityId(cityId);
        }

        log.info("Weather Data Sync Job. End！");
    }
}
