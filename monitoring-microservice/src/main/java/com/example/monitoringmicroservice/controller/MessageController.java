package com.example.monitoringmicroservice.controller;

import com.example.monitoringmicroservice.dto.SensorData;
import com.example.monitoringmicroservice.publisher.RabbitMQProducer;
import com.example.monitoringmicroservice.repo.Request;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/queue")
public class MessageController {
    private final RabbitMQProducer producer;
    private final Request request = new Request();

    public MessageController(RabbitMQProducer producer) {
        this.producer = producer;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(
            @RequestBody SensorData sensorData

    ) {

        producer.sendMessage(sensorData);
        return ResponseEntity.ok("Message has been sent.");
    }
}
