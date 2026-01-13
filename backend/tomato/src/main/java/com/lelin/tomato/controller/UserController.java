package com.lelin.tomato.controller;

import com.lelin.tomato.dto.UpdateUsernameRequest;
import com.lelin.tomato.model.User;
import com.lelin.tomato.repository.UserRepository;
import com.lelin.tomato.security.JWTUtil;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

  private final UserRepository userRepository;
  private final JWTUtil jwtUtil;

  @PatchMapping("/me/username")
  public ResponseEntity<?> updateUsername(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @Valid @RequestBody UpdateUsernameRequest request) {

    if (authorization == null || !authorization.startsWith("Bearer ")) {
      return ResponseEntity.status(401).body(Map.of("error", "Missing token"));
    }

    String token = authorization.substring(7);
    Long userId = jwtUtil.extractUserId(token);

    return userRepository.findById(userId)
        .<ResponseEntity<?>>map(user -> applyUsernameUpdate(user, request))
        .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "User not found")));
  }

  private ResponseEntity<?> applyUsernameUpdate(User user, UpdateUsernameRequest request) {
    String desiredUsername = request.getUsername().trim();

    if (desiredUsername.equals(user.getUsername())) {
      return ResponseEntity.ok(Map.of("message", "Username unchanged", "user", user));
    }

    user.setUsername(desiredUsername);
    User saved = userRepository.save(user);
    return ResponseEntity.ok(Map.of("message", "Username updated", "user", saved));
  }
}
