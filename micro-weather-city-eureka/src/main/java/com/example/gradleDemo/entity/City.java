package com.example.gradleDemo.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@XmlRootElement(name = "d")
@XmlAccessorType(XmlAccessType.FIELD)
public class City {
    @XmlAttribute(name = "d1")
    private String cityId;

    @XmlAttribute(name = "d2")
    private String cityName;

    @XmlAttribute(name = "d3")
    private String cityCode;

    @XmlAttribute(name = "d4")
    private String province;
}
