package com.lelin.tomato.service;

import com.lelin.tomato.dto.LoginRequest;
import com.lelin.tomato.dto.RegisterRequest;
import com.lelin.tomato.model.User;
import com.lelin.tomato.repository.UserRepository;

import com.lelin.tomato.security.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

//  private final UserRepository userRepository;
//  private final BCryptPasswordEncoder passwordEncoder;
  private final JWTUtil jwtUtil;

  public User register(RegisterRequest request) {

    if (userRepository.existsByEmail(request.getEmail())) {
      throw new RuntimeException("Email already taken");
    }

    User user = User.builder()
        .username(request.getUsername())
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))
        .createdAt(LocalDateTime.now())
        .infestationLevel(0)
        .build();

    return userRepository.save(user);
  }

  public String login(LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new RuntimeException("User not found"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
      throw new RuntimeException("Invalid password");
    }

    return jwtUtil.generateToken(user.getId());
  }
}

