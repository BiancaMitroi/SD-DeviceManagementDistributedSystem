package com.example.monitoringmicroservice.controller;

import com.example.monitoringmicroservice.dto.Map;
import com.example.monitoringmicroservice.dto.SensorData;
import com.example.monitoringmicroservice.publisher.SensorThread;
import com.example.monitoringmicroservice.repo.Request;
import com.example.monitoringmicroservice.repo.SensorRepo;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("api/v1/sensor")
public class SensorController {

    List<SensorThread> threads = new ArrayList<>();
    Request request = new Request();

    @Data
    public static class BodyRequest {
        private List<Integer> sensorIds;
        private String date;
    }

    private final SensorRepo sensorRepo;

    @PostMapping("/getBySensorId")
    public ResponseEntity<List<SensorData>> getData(
        @RequestBody BodyRequest bodyRequest,
        @RequestHeader("Authorization") String token
    ) {
        request.authorizeToken(token);
        List<SensorData> sensorsData = sensorRepo.getSensorDataBySensorId(bodyRequest.getSensorIds(), bodyRequest.getDate());
        System.out.println(sensorsData);
        return ResponseEntity.ok(sensorsData);
    }

    @PostMapping("/create")
    public ResponseEntity<String> createSensorThread(
            @RequestBody Map mapping,
            @RequestHeader("Authorization") String token
    ){
        request.authorizeToken(token);
        System.out.println(mapping.getMappingId());
        System.out.println(mapping.getUserMail());
        SensorThread sensorThread = new SensorThread(mapping);
        threads.add(sensorThread);
        System.out.println(threads);
        return ResponseEntity.ok("Thread with id" + mapping.getMappingId() + " was created");
    }

    @PostMapping("/toggle")
    public ResponseEntity<String> runSensorThread(
            @RequestBody Integer id,
            @RequestHeader("Authorization") String token
    ){
        request.authorizeToken(token);
        System.out.println(id);
        SensorThread th = threads.stream().filter(thread -> thread.getMappingId().equals(id)).toList().get(0);
        th.setRunning(!th.isRunning());
        if (th.isRunning()) {
            th.interrupt();
        } else {
            th.run();
        }
        return ResponseEntity.ok("Thread with id" + th.getMappingId() + " is running");
    }

    @PostMapping("/delete")
    public ResponseEntity<String> deleteSensorThread(
            @RequestBody int id,
            @RequestHeader("Authorization") String token
    ){
        request.authorizeToken(token);
        List<SensorThread> threadsToDelete = threads.stream().filter(thread1 -> thread1.getMappingId() == id).toList();
        List<SensorData> sensorData = sensorRepo.getBySensorId(id);
        for (SensorThread sensorThread : threadsToDelete) {
            sensorThread.interrupt();
            threads.remove(sensorThread);
        }
        sensorRepo.deleteAll(sensorData);
        return ResponseEntity.ok("Thread with id" + id + " was created");
    }
}
