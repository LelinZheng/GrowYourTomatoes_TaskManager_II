package com.lelin.tomato.controller;

import com.lelin.tomato.dto.LoginRequest;
import com.lelin.tomato.dto.RegisterRequest;
import com.lelin.tomato.model.User;
import com.lelin.tomato.service.AuthService;
import com.lelin.tomato.repository.UserRepository;
import com.lelin.tomato.security.JWTUtil;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final JWTUtil jwtUtil;
  private final UserRepository userRepository;

  @PostMapping("/register")
  public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
    User user = authService.register(request);
    return ResponseEntity.ok(Map.of(
        "message", "Registration successful",
        "user", user
    ));
  }
  @PostMapping("/login")
  public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
    String token = authService.login(request);
    User user = userRepository.findByEmail(request.getEmail()).orElse(null);
    return ResponseEntity.ok(Map.of("token", token, "user", user));
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String authorization) {
    if (authorization == null || !authorization.startsWith("Bearer ")) {
      return ResponseEntity.status(401).body(Map.of("error", "Missing token"));
    }
    String token = authorization.substring(7);
    Long userId = jwtUtil.extractUserId(token);
    return userRepository.findById(userId)
        .<ResponseEntity<?>>map(user -> ResponseEntity.ok(user))
        .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "User not found")));
  }
}
