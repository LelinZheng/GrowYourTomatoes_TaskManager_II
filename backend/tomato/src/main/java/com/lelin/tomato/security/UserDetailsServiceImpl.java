package com.lelin.tomato.security;

import com.lelin.tomato.model.User;
import com.lelin.tomato.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

  private final UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String userIdString) throws UsernameNotFoundException {
    Long userId = Long.parseLong(userIdString);

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    return org.springframework.security.core.userdetails.User.builder()
        .username(String.valueOf(user.getId()))  // internal identity
        .password(user.getPassword())
        .roles("USER")
        .build();
  }
}
