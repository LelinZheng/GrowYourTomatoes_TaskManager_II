package com.lelin.tomato.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateUsernameRequest {

  @NotBlank(message = "Username is required")
  @Pattern(regexp = "^[a-zA-Z0-9_]{3,}$", message = "Username must be 3+ characters (alphanumeric & underscore)")
  private String username;
}
