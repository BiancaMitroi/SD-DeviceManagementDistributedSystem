package com.example.usersmicroservice.controller;

import com.example.usersmicroservice.model.User;
import com.example.usersmicroservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("hasAnyRole('MANAGER', 'USER')")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final UserService userService;

    @GetMapping("/getByEmail")
    @PreAuthorize("hasAnyAuthority('manager:read', 'user:read')")
    public ResponseEntity<User> getByEmail(@RequestParam String email) {
        return userService.getByEmail(email);
    }

}
