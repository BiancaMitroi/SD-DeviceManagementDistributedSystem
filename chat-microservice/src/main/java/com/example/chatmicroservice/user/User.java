package com.example.chatmicroservice.user;

import lombok.Getter;

@Getter
public class User {
    private Integer id;
    private String name;
    private String email;
    private String password;
    private Role role;
}
