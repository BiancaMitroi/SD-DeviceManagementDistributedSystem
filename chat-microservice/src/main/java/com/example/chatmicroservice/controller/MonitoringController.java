package com.example.chatmicroservice.controller;

import com.example.chatmicroservice.CustomWebSocketHandler;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("api/v1/chat")
public class MonitoringController {

    private final CustomWebSocketHandler socketHandler = CustomWebSocketHandler.getInstance();

    @Data
    @RequiredArgsConstructor
    public static class Message {
        private String message;
        private String userMail;
    }

    @PostMapping()
    public ResponseEntity<String> handleNotifications(
        Message message
    ) throws Exception {
        socketHandler.handleMessageFromServer(message.message, message.userMail);
        return ResponseEntity.ok("");
    }
}
