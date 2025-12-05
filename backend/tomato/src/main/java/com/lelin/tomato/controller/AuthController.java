package com.lelin.tomato.controller;

import com.lelin.tomato.dto.RegisterRequest;
import com.lelin.tomato.model.User;
import com.lelin.tomato.service.AuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
    User user = authService.register(request);
    return ResponseEntity.ok("Registration successful for user: " + user.getUsername());
  }
}
