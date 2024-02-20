package com.example.devicesmicroservice.service;

import com.example.devicesmicroservice.controller.MapController;
import com.example.devicesmicroservice.dto.DeviceDto;
import com.example.devicesmicroservice.model.Device;
import com.example.devicesmicroservice.repo.IDeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DeviceService implements IDeviceService {
    public final IDeviceRepository deviceRepository;


    @Override
    public ResponseEntity<List<Device>> getAll() {
        return ResponseEntity.ok(deviceRepository.findAll());
    }

    @Override
    public ResponseEntity<Device> getById(Integer id) {
        Device device = deviceRepository.findById(id).orElse(null);
        if(device != null)
            return ResponseEntity.ok(device);
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<Device> add(DeviceDto device) {
        Device deviceMapped = new Device();
        deviceMapped.setAddress(device.getAddress());
        deviceMapped.setMaximumConsumption(device.getMaximumConsumption());
        deviceMapped.setDescription(device.getDescription());
        deviceRepository.save(deviceMapped);
        return ResponseEntity.created(URI.create("/device/" + deviceMapped.getId())).body(deviceMapped);
    }

    @Override
    public ResponseEntity<Device> edit(Integer id, DeviceDto deviceDetails) {
        Device device = deviceRepository.findById(id).orElse(null);
        if(device != null) {
            device = Device.builder()
                    .id(id)
                    .address(deviceDetails.getAddress().isEmpty() ? device.getAddress() : deviceDetails.getAddress())
                    .maximumConsumption(deviceDetails.getMaximumConsumption() == null ? device.getMaximumConsumption() : deviceDetails.getMaximumConsumption())
                    .description(deviceDetails.getDescription().isEmpty() ? device.getDescription() : deviceDetails.getDescription())
                    .build();
            deviceRepository.save(device);
            return ResponseEntity.ok(device);
        }
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<Void> delete(Integer id) {
        Optional<Device> device = deviceRepository.findById(id);
        if(device.isPresent()) {
            deviceRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
