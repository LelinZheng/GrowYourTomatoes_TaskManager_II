package com.lelin.tomato.repository;

import com.lelin.tomato.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface TaskRepository extends JpaRepository<Task, Long> {

  // get all tasks owned by user
  List<Task> findByUserId(Long userId);
  List<Task> findByTimeBombEnabledTrueAndCompletedFalseAndExpiredFalseAndDueTimeBefore(LocalDateTime now);
}
