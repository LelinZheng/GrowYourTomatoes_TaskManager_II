package com.lelin.tomato.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JWTUtil {

  @Value("${jwt.secret}")
  private String SECRET;

  @Value("${jwt.expiration}")
  private long EXPIRATION;

  public String generateToken(Long userId) {
    return Jwts.builder()
        .setSubject(String.valueOf(userId))  // store ID as string
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
        .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
        .compact();
  }

  public Long extractUserId(String token) {
    Claims claims = Jwts.parserBuilder()
        .setSigningKey(SECRET.getBytes())
        .build()
        .parseClaimsJws(token)
        .getBody();

    return Long.parseLong(claims.getSubject());
  }

  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder()
          .setSigningKey(SECRET.getBytes())
          .build()
          .parseClaimsJws(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }
}