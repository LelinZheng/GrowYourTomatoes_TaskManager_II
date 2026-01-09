package com.lelin.tomato.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginRequest {
  @Email
  private String email;
  @NotBlank
  @Size(min = 6, message = "Password must be at least 6 characters")
  private String password;

  public String getEmail() {return email;}

  public void setEmail(String email) {this.email = email;}

  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
}
