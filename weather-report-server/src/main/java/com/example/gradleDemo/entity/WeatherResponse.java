package com.example.gradleDemo.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WeatherResponse implements Serializable {

    private static final long serialVersionUID = 1L;
    private Weather data;
    private Integer status;
    private String desc;
}
