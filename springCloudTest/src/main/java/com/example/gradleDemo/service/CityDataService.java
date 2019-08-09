package com.example.gradleDemo.service;

import com.example.gradleDemo.entity.City;

import java.util.List;

public interface CityDataService {

    /**
     * 获取City列表
     * @return
     * @throws Exception
     */
    List<City> listCity() throws Exception;
}
