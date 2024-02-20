package com.example.usersmicroservice.controller;
import com.example.usersmicroservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api/v1/users")
public class NoAuthController {
    private final UserService userService;

    @PostMapping("/getUser")
    public ResponseEntity<String> getUser(@RequestBody Integer id) {
        System.out.println(id);
        return ResponseEntity.ok(Objects.requireNonNull(userService.getById(id).getBody()).getEmail());
    }
}
