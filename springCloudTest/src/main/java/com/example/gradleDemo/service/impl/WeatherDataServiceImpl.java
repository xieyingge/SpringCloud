package com.example.gradleDemo.service.impl;

import com.example.gradleDemo.entity.WeatherResponse;
import com.example.gradleDemo.service.WeatherDataService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class WeatherDataServiceImpl implements WeatherDataService {
    private static final String WEATHER_URI = "http://wthrcdn.etouch.cn/weather_mini?";

    @Autowired
    private RestTemplate restTemplate;

    private static final long TIME_OUT = 1800L; // 1800s

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Override
    public WeatherResponse getDataByCityId(String cityId) {
        String uri = WEATHER_URI + "citykey=" + cityId;
        return this.doGetWeahter(uri);
    }

    @Override
    public Object getAllCityNameAndIdInWeatherSystem() {
        ResponseEntity<String> forEntity = restTemplate.getForEntity("http://mobile.weather.com.cn/js/citylist.xml", String.class);
        return forEntity;
    }

    @Override
    public WeatherResponse getDataByCityName(String cityName) {
        String uri = WEATHER_URI + "city=" + cityName;
        return this.doGetWeahter(uri);
    }

    private WeatherResponse doGetWeahter(String uri) {
        String key = uri;
        String strBody = null;
        ObjectMapper mapper = new ObjectMapper();
        WeatherResponse resp = null;
        ValueOperations<String, String> ops = stringRedisTemplate.opsForValue();
        // 先查缓存，缓存有的取缓存中的数据
        if (stringRedisTemplate.hasKey(key)) {

            log.info("Redis has data");
            strBody = ops.get(key);
        } else {
            log.info("Redis don't has data");
            strBody = getDataToRedis(uri, key, strBody, ops);
        }

        try {
            resp = mapper.readValue(strBody, WeatherResponse.class);
        } catch (IOException e) {
            log.error("Error!",e);
        }
        return resp;
    }

    private String getDataToRedis(String uri, String key, String strBody, ValueOperations<String, String> ops) {
        // 缓存没有，再调用服务接口来获取
        ResponseEntity<String> respString = restTemplate.getForEntity(uri, String.class);

        if (respString.getStatusCodeValue() == 200) {
            strBody = respString.getBody();
        }

        // 数据写入缓存
        ops.set(key, strBody, TIME_OUT, TimeUnit.SECONDS);
        return strBody;
    }

    @Override
    public void syncDateByCityId(String cityId) {
        String uri = WEATHER_URI + "citykey=" + cityId;
        this.saveWeatherData(uri);
    }

    /**
     * 把天气数据放在缓存
     * @param uri
     */
    private void saveWeatherData(String uri) {
        String key = uri;
        String strBody = null;
        ValueOperations<String, String>  ops = stringRedisTemplate.opsForValue();

        // 调用服务接口来获取
        strBody = getDataToRedis(uri, key, strBody, ops);

    }
}
