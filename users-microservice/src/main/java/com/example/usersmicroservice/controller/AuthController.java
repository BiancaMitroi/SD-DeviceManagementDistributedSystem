package com.example.usersmicroservice.controller;

import com.example.usersmicroservice.dto.AuthResponse;
import com.example.usersmicroservice.dto.LoginRequest;
import com.example.usersmicroservice.dto.RegisterRequest;
import com.example.usersmicroservice.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authenticationService.login(request));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws Exception {
        authenticationService.refreshToken(request, response);
    }

    @PostMapping("/authenticate-token")
    public ResponseEntity<Boolean> authenticateToken(@RequestBody String token){
        return authenticationService.authenticateToken(token);
    }

}
