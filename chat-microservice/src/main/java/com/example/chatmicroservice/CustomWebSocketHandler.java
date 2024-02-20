package com.example.chatmicroservice;
import jakarta.annotation.Nonnull;
import org.json.JSONObject;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;

public class CustomWebSocketHandler extends TextWebSocketHandler {

    private final Map<WebSocketSession, List<String>> sessions = new HashMap<>();

    public void afterConnectionEstablished(@Nonnull WebSocketSession session) {

        List<String> queryParam = List.of(Objects.requireNonNull(session.getUri()).getQuery().split("[=&]"));
        System.out.println(queryParam);
        System.out.println(sessions);
        String from = queryParam.get(1);
        String to = queryParam.get(3);
        String status = queryParam.get(5);
        String role = queryParam.get(7);
        List<String> values = new ArrayList<>();
        values.add(from);
        values.add(role);
        if(!sessions.containsValue(values)) {
            sessions.put(session, values);
            try {
                session.sendMessage(new TextMessage(convertMessage("server", from, "asigned", "ROLE_MANAGER", "server").toString()));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

            System.out.println("websocket connected with id = " + from + " and role = " + role);
            System.out.println(sessions);
            for (Map.Entry<WebSocketSession, List<String>> asigned : sessions.entrySet()) {
                for (Map.Entry<WebSocketSession, List<String>> asignee : sessions.entrySet()) {
                    if ((asigned.getKey().equals(session) || asignee.getKey().equals(session)) && (asigned.getValue().get(1).equals("ROLE_MANAGER") && asignee.getValue().get(1).equals("ROLE_USER") || asigned.getValue().get(1).equals("ROLE_USER") && asignee.getValue().get(1).equals("ROLE_MANAGER"))) {
                        try {
                            asigned.getKey().sendMessage(new TextMessage(convertMessage(asignee.getValue().get(0), asigned.getValue().get(0), "asigned", asignee.getValue().get(1), asignee.getValue().get(0)).toString()));
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    }
                }
            }
        }
    }

    private static final CustomWebSocketHandler handler = new CustomWebSocketHandler();
    private CustomWebSocketHandler(){}

    public static CustomWebSocketHandler getInstance(){
        return handler;
    }

    @Override
    public void afterConnectionClosed(@Nonnull WebSocketSession session, @Nonnull CloseStatus status) {
        sessions.remove(session);
    }

    private JSONObject convertMessage(String from, String to, String status, String role, String content){
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("from", from);
        jsonObject.put("to", to);
        jsonObject.put("status", status);
        jsonObject.put("role", role);
        jsonObject.put("content", content);
        return jsonObject;
    }

    public void sendMessageToAll(String message) {
        System.out.println("sending message");
        for (Map.Entry<WebSocketSession, List<String>> entry : sessions.entrySet()) {
            try {
                entry.getKey().sendMessage(new TextMessage(message));
            } catch (Exception e) {
                System.out.println("Send message from server via WebSocket failed");
            }
        }
    }
    public void sendMessageToOne(String from, String to, String status, String role, String message) {
        System.out.println(message);
        for (Map.Entry<WebSocketSession, List<String>> entry : sessions.entrySet())
            if(entry.getValue().get(0).equals(to)){
                try {
                    entry.getKey().sendMessage(new TextMessage(convertMessage(from, to, status, role, message).toString()));
                } catch (Exception e) {
                    System.out.println("Send message from server via WebSocket failed");
                }
        }
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
//        List<String> queryParam = List.of(Objects.requireNonNull(session.getUri()).getQuery().split("[=&]"));
//        System.out.println(queryParam);
        System.out.println(message);
        JSONObject messageConverted = new JSONObject(message.getPayload().toString());
        System.out.println(messageConverted);
        String from = messageConverted.getString("from");
        String to = messageConverted.getString("to");
        String status = messageConverted.getString("status");
        String role = messageConverted.getString("role");
        String content = messageConverted.getString("content");
        if(to.isEmpty()) to = content;
        sendMessageToOne(from, to, status, role, content);
    }

    public void handleMessageFromServer(String message, String userMail) throws Exception {
        sendMessageToOne("server", userMail, "content", "ROLE_MANAGER", message);
    }
}