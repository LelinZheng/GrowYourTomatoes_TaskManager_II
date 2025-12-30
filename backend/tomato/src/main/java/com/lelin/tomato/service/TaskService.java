package com.lelin.tomato.service;

import com.lelin.tomato.model.Task;
import com.lelin.tomato.repository.TaskRepository;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskService {

  private final TaskRepository taskRepository;
  private final PunishmentService punishmentService;
  private final TomatoService tomatoService;

  public Task createTask(Task task, Long userId) {
    task.setUserId(userId);
    task.setCreatedAt(LocalDateTime.now());
    task.setCompleted(false);
    task.setExpired(false);

    // If dueTime is null, timeBomber should not trigger
    task.setTimeBombEnabled(task.getDueTime() != null);

    return taskRepository.save(task);
  }

  public List<Task> getTasks(Long userId) {
    return taskRepository.findByUserId(userId);
  }

  public Task updateTask(Long id, Task updatedTask, Long userId) {
    Task task = taskRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Task not found"));

    if (!task.getUserId().equals(userId)) {
      throw new RuntimeException("Unauthorized");
    }

    task.setTitle(updatedTask.getTitle());
    task.setDescription(updatedTask.getDescription());
    task.setPriority(updatedTask.getPriority());
    task.setDueTime(updatedTask.getDueTime());

    // Auto-set if timeBombEnabled should be turned on/off
    task.setTimeBombEnabled(updatedTask.getDueTime() != null);

    return taskRepository.save(task);
  }

  @Transactional
  public void deleteTask(Long id, Long userId) {
    Task task = taskRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Task not found"));

    if (!task.getUserId().equals(userId)) {
      throw new RuntimeException("Unauthorized");
    }

    if (task.isCompleted() && task.getTomatoesEarned() > 0) {
      tomatoService.removeTomatoForTask(userId, task.getId());
    }

    taskRepository.delete(task);
  }

  @Transactional
  public Task completeTask(Long taskId, Long userId) {
    Task task = taskRepository.findById(taskId)
        .orElseThrow(() -> new RuntimeException("Task not found"));

    if (!Objects.equals(task.getUserId(), userId)) {
      throw new RuntimeException("Unauthorized");
    }

    if (task.isCompleted()) return task;

    task.setCompleted(true);
    task.setCompletedAt(LocalDateTime.now());

    if (task.isExpired()) {
      task.setTomatoesEarned(1);
      taskRepository.save(task);
      tomatoService.addTomato(userId, taskId);
      return task;
    }

    var resolved = punishmentService.resolveOldestPunishment(userId, taskId);

    if (resolved != null) {
      task.setTomatoesEarned(0);
      taskRepository.save(task);
      return task;
    }

    task.setTomatoesEarned(1);
    taskRepository.save(task);
    tomatoService.addTomato(userId, taskId);
    return task;
  }
}


