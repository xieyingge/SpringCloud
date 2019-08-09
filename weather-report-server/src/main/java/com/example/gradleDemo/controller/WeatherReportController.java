package com.example.gradleDemo.controller;

import com.example.gradleDemo.entity.City;
import com.example.gradleDemo.service.WeatherReportService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;


@Slf4j
@RestController
@RequestMapping("/report")
public class WeatherReportController {

    @Autowired
    private WeatherReportService weatherReportService;

    @GetMapping("/cityId/{cityId}")
    public ModelAndView getReportByCityId(@PathVariable("cityId") String cityId, Model model) throws Exception {
        // 获取城市ID列表
        // TODO 改为由城市数据API微服务来提供数据
        List<City> cityList = null;
        try {
            // TODO 改为由城市数据API微服务提供数据
            cityList = new ArrayList<>();
            City city = new City();
            city.setCityId("101280601");
            city.setCityName("深圳");
            cityList.add(city);

        } catch (Exception e) {
            log.error("Exception!", e);
        }

        model.addAttribute("title", "天气预报");
        model.addAttribute("cityId", cityId);
        model.addAttribute("cityList", cityList);
        model.addAttribute("report", weatherReportService.getDataByCityId(cityId));
        return new ModelAndView("weather/report", "reportModel", model);
    }
}
