package com.example.devicesmicroservice.controller;

import com.example.devicesmicroservice.dto.DeviceDto;
import com.example.devicesmicroservice.model.Device;
import com.example.devicesmicroservice.model.Map;
import com.example.devicesmicroservice.repo.MapRepo;
import com.example.devicesmicroservice.repo.Request;
import com.example.devicesmicroservice.service.DeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/devices")
@RequiredArgsConstructor
@CrossOrigin
public class DeviceController {

    private final DeviceService deviceService;
    private final Request request;
    private final MapRepo mapRepo;
    public final MapController mapController;

    @GetMapping("/get")
    public ResponseEntity<List<Device>> getAll(
            @RequestHeader("Authorization") String token
    ) {
        System.out.println(token);
        Boolean b = request.authorizeToken(token).getBody();
        if(Boolean.TRUE.equals(b)) {
            return deviceService.getAll();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/getById")
    public ResponseEntity<Device> getById(
            @RequestHeader("Authorization") String token,
            @RequestParam Integer id
    ) {
        if(Boolean.TRUE.equals(request.authorizeToken(token).getBody()))
            return deviceService.getById(id);
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/getDeviceById")
    public ResponseEntity<Device> getDeviceById(
            @RequestBody Integer id
    ) {
        Map map = mapRepo.findById(id).orElseThrow();
        return deviceService.getById(map.getDeviceId());
    }

    @PostMapping("/add")
    public ResponseEntity<Device> add(
            @RequestHeader("Authorization") String token,
            @RequestBody DeviceDto device
    ) {
        if(Boolean.TRUE.equals(request.authorizeToken(token).getBody()))
            return deviceService.add(device);
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/edit")
    public ResponseEntity<Device> edit(
            @RequestHeader("Authorization") String token,
            @RequestParam Integer id,
            @RequestBody DeviceDto deviceDetails
    ) {
        if(Boolean.TRUE.equals(request.authorizeToken(token).getBody()))
            return deviceService.edit(id, deviceDetails);
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> delete(
            @RequestHeader("Authorization") String token,
            @RequestParam Integer id
    ) {
        if(Boolean.TRUE.equals(request.authorizeToken(token).getBody())){
            mapController.deleteDevicesByDeviceId(token, id);
            return deviceService.delete(id);
        }
        return ResponseEntity.notFound().build();
    }
}
