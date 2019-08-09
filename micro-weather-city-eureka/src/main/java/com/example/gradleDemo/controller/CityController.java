package com.example.gradleDemo.controller;

import com.example.gradleDemo.entity.City;
import com.example.gradleDemo.service.CityDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/city")
public class CityController {

    @Autowired
    private CityDataService cityDataService;

    @GetMapping("listCity")
    public List<City> listCity() throws Exception {
        return cityDataService.listCity();
    }
}
