package com.example.usersmicroservice.repo;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
@RequiredArgsConstructor
@Service
public class MapRepository {
    private final RestTemplate restTemplate;

    public void deleteMaps(Integer id, String token) {
        String apiUrl = "http://users-microservice:8081/api/v1/devices/deleteDevices";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("Authorization", token);
        HttpEntity<String> requestEntity = new HttpEntity<>(id.toString(), headers);
        ResponseEntity<Void> response = restTemplate.postForEntity(apiUrl, requestEntity, Void.class);
    }
}
