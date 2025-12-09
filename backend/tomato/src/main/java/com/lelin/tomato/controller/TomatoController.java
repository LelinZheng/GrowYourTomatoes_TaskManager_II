package com.lelin.tomato.controller;

import com.lelin.tomato.model.Tomato;
import com.lelin.tomato.service.TomatoService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tomatoes")
@RequiredArgsConstructor
public class TomatoController {

  private final TomatoService tomatoService;

  private Long getLoggedInUserId() {
    return Long.parseLong(SecurityContextHolder.getContext()
        .getAuthentication()
        .getName());
  }

  @GetMapping("/count")
  public long getCount() {
    return tomatoService.getTomatoCount(getLoggedInUserId());
  }

  @GetMapping("/history")
  public List<Tomato> getHistory() {
    return tomatoService.getTomatoHistory(getLoggedInUserId());
  }
}
