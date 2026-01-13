package com.lelin.tomato.service;

import com.lelin.tomato.model.Punishment;
import com.lelin.tomato.repository.PunishmentRepository;
import com.lelin.tomato.model.PunishmentType;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PunishmentService {

  private final PunishmentRepository punishmentRepo;

  public Punishment createPunishmentForUser(Long userId, Long taskId) {
    Punishment p = Punishment.builder()
        .userId(userId)
        .taskId(taskId)
        .type(randomType())
        .createdAt(LocalDateTime.now())
        .resolved(false)
        .build();
    return punishmentRepo.save(p);
  }

  private PunishmentType randomType() {
    PunishmentType[] types = PunishmentType.values();
    return types[(int)(Math.random() * types.length)];
  }

  public Punishment resolveOldestPunishment(Long userId, Long newTaskId) {
    return punishmentRepo.findFirstByUserIdAndResolvedFalseOrderByCreatedAtAsc(userId)
        .map(p -> {
          p.setResolved(true);
          p.setResolvedByTaskId(newTaskId);
          return punishmentRepo.save(p);
        })
        .orElse(null); // no punishments to resolve
  }

  public List<Punishment> getAllForUser(Long userId) {
    return punishmentRepo.findByUserId(userId);
  }

  public List<Punishment> getActiveForUser(Long userId) {
    return punishmentRepo.findByUserIdAndResolvedFalseOrderByCreatedAtAsc(userId);
  }
}
