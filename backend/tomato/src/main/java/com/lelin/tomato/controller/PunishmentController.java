package com.lelin.tomato.controller;

import com.lelin.tomato.model.Punishment;
import com.lelin.tomato.service.PunishmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/punishments")
@RequiredArgsConstructor
public class PunishmentController {

  private final PunishmentService punishmentService;

  private Long getLoggedInUserId() {
    return Long.parseLong(SecurityContextHolder.getContext()
        .getAuthentication()
        .getName());
  }

  @GetMapping
  public List<Punishment> getAll() {
    return punishmentService.getAllForUser(getLoggedInUserId());
  }

  @GetMapping("/active")
  public List<Punishment> getActive() {
    return punishmentService.getActiveForUser(getLoggedInUserId());
  }
}
