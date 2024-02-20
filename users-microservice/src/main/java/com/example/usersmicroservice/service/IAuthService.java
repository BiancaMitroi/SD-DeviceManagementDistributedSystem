package com.example.usersmicroservice.service;

import com.example.usersmicroservice.dto.AuthResponse;
import com.example.usersmicroservice.dto.LoginRequest;
import com.example.usersmicroservice.dto.RegisterRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

public interface IAuthService {

    void refreshToken(HttpServletRequest request, HttpServletResponse response) throws Exception;
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    ResponseEntity<Boolean> authenticateToken(String httpToken) throws Exception;
}
