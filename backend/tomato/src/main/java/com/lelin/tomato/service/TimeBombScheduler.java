package com.lelin.tomato.service;

import com.lelin.tomato.model.Task;
import com.lelin.tomato.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TimeBombScheduler {

  private final TaskRepository taskRepo;
  private final PunishmentService punishmentService;

  @Scheduled(fixedRate = 30000) // every 30s
  public void checkExpiredTasks() {
    LocalDateTime now = LocalDateTime.now();

    List<Task> toExpire = taskRepo
        .findByTimeBombEnabledTrueAndCompletedFalseAndExpiredFalseAndDueTimeBefore(now);

    for (Task task : toExpire) {
      task.setExpired(true);
      taskRepo.save(task);

      punishmentService.createPunishmentForUser(task.getUserId(), task.getId());
    }
  }
}
