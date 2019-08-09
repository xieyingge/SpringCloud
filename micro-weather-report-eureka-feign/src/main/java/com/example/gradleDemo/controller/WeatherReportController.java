package com.example.gradleDemo.controller;

import com.example.gradleDemo.entity.City;
import com.example.gradleDemo.entity.Weather;
import com.example.gradleDemo.service.CityClient;
import com.example.gradleDemo.service.WeatherReportService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.Comparator;
import java.util.List;


@Slf4j
@RestController
@RequestMapping("/report")
public class WeatherReportController {

    @Autowired
    private WeatherReportService weatherReportService;

    @Autowired
    private CityClient cityClient;



    @GetMapping("/cityId/{cityId}")
    public ModelAndView getReportByCityId(@PathVariable("cityId") String cityId, Model model) throws Exception {
        // 获取城市ID列表
        // TODO 改为由城市数据API微服务来提供数据
        List<City> cityList = null;
        try {
            cityList = cityClient.cityList();
            cityList.sort(Comparator.comparing(City::getCityName));
        } catch (Exception e) {
            log.error("Exception!", e);
        }
        Weather data = weatherReportService.getDataByCityId(cityId).getData();

        model.addAttribute("title", "天气预报");
        model.addAttribute("cityId", cityId);
        model.addAttribute("cityList", cityList);
        model.addAttribute("report",data);
        return new ModelAndView("weather/report", "reportModel", model);
    }
}
