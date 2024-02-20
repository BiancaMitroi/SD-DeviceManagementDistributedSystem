package com.example.devicesmicroservice.dto;

import lombok.Data;

@Data
public class DeviceDto {
    private String address;
    private Double maximumConsumption;
    private String description;
}
