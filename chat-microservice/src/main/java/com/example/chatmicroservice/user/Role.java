package com.example.chatmicroservice.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Set;

import static com.example.chatmicroservice.user.Permission.*;

@Getter
@RequiredArgsConstructor
public enum Role {
    USER(Set.of(USER_READ)),
    MANAGER(Set.of(
            MANAGER_CREATE,
            MANAGER_READ,
            MANAGER_UPDATE,
            MANAGER_DELETE
            )
    );

    private final Set<Permission> permissions;
}
