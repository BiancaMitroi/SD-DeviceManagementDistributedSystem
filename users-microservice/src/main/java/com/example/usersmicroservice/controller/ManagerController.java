package com.example.usersmicroservice.controller;

import com.example.usersmicroservice.model.Token;
import com.example.usersmicroservice.model.User;
import com.example.usersmicroservice.repo.MapRepository;
import com.example.usersmicroservice.repo.ITokenRepository;
import com.example.usersmicroservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@PreAuthorize("hasRole('MANAGER')")
@RequiredArgsConstructor
@CrossOrigin
public class ManagerController {

    private final UserService userService;
    private final ITokenRepository tokenRepository;
    private final MapRepository mapRepository;

    @GetMapping("/get")
    @PreAuthorize("hasAuthority('manager:read')")
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(userService.getAll());
    }

    @GetMapping("/getById")
    @PreAuthorize("hasAuthority('manager:read')")
    public ResponseEntity<User> getById(@RequestParam Integer id) {
        return userService.getById(id);
    }

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('manager:create')")
    public ResponseEntity<User> add(@RequestBody User user) {
        return userService.add(user);
    }

    @PatchMapping("/edit")
    @PreAuthorize("hasAuthority('manager:update')")
    public ResponseEntity<User> edit(@RequestParam Integer id, @RequestBody User userDetails) {
        List<Token> tokens = tokenRepository.findAllValidTokenByUser(id);
        tokenRepository.deleteAll(tokens);
        return userService.edit(id, userDetails);
    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasAuthority('manager:delete')")
    public ResponseEntity<Void> delete(
            @RequestHeader ("Authorization") String token,
            @RequestParam Integer id
    ) {
        List<Token> tokens = tokenRepository.findAllValidTokenByUser(id);
        tokenRepository.deleteAll(tokens);
        mapRepository.deleteMaps(id, token);
        return userService.delete(id);
    }
}
