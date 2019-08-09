package com.example.gradleDemo.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class City {
    private String cityId;
    private String cityName;
    private String cityCode;
    private String province;
}
