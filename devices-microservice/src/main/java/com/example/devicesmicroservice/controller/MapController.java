package com.example.devicesmicroservice.controller;

import com.example.devicesmicroservice.dto.MapDto;
import com.example.devicesmicroservice.model.Map;
import com.example.devicesmicroservice.repo.MapRepo;
import com.example.devicesmicroservice.repo.Request;
import com.example.devicesmicroservice.service.MapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/devices")
@RequiredArgsConstructor
public class MapController {
    private final MapService mapService;
    private final MapRepo mapRepo;
    private final Request request;

    @PostMapping("/map")
    public ResponseEntity<Map> add(
            @RequestHeader("Authorization") String token,
            @RequestBody MapDto map
    ) {
        request.authorizeToken(token);
        return mapService.map(map, token);
    }

    @GetMapping("/getDevicesId")
    public ResponseEntity<List<Map>> getDevicesIdByUserId(
            @RequestHeader("Authorization") String token,
            @RequestParam Integer id
    ) {
        request.authorizeToken(token);
        return mapService.getDevicesIdByUserId(id);
    }

    @PostMapping("/deleteDevices")
    public ResponseEntity<Void> deleteDevicesByUserId(
            @RequestHeader("Authorization") String token,
            @RequestBody Integer id
    ) {
        request.authorizeToken(token);
        List<Map> maps =  mapRepo.findByUserId(id);
        mapRepo.deleteAll(maps);
        for(Map map : maps) {
            request.deleteSensor(map.getId(), token);
        }
        return ResponseEntity.noContent().build();
    }

//    @PostMapping("/deleteMaps")
    public void deleteDevicesByDeviceId(
            @RequestHeader("Authorization") String token,
            @RequestBody Integer id
    ) {
        request.authorizeToken(token);
        List<Map> maps =  mapRepo.findByDeviceId(id);
        mapRepo.deleteAll(maps);
        for(Map map : maps) {
            request.deleteSensor(map.getId(), token);
        }
        ResponseEntity.noContent().build();
    }
}
