package com.lelin.tomato.service;

import com.lelin.tomato.model.Task;
import com.lelin.tomato.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

  private final TaskRepository taskRepo;

  public Task createTask(Task task, Long userId) {
    task.setUserId(userId);
    task.setCreatedAt(LocalDateTime.now());
    return taskRepo.save(task);
  }

  public List<Task> getTasks(Long userId) {
    return taskRepo.findByUserId(userId);
  }

  public Task updateTask(Long taskId, Task updated, Long userId) {
    Task existing = taskRepo.findById(taskId)
        .orElseThrow(() -> new RuntimeException("Task not found"));

    if (!existing.getUserId().equals(userId)) {
      throw new RuntimeException("Unauthorized");
    }

    existing.setTitle(updated.getTitle());
    existing.setDescription(updated.getDescription());
    existing.setImportance(updated.getImportance());
    existing.setTimeBomber(updated.getTimeBomber());

    return taskRepo.save(existing);
  }

  public void deleteTask(Long taskId, Long userId) {
    Task task = taskRepo.findById(taskId)
        .orElseThrow(() -> new RuntimeException("Task not found"));

    if (!task.getUserId().equals(userId)) {
      throw new RuntimeException("Unauthorized");
    }

    taskRepo.delete(task);
  }

  public Task completeTask(Long taskId, Long userId) {
    Task task = taskRepo.findById(taskId)
        .orElseThrow(() -> new RuntimeException("Task not found"));

    if (!task.getUserId().equals(userId)) {
      throw new RuntimeException("Unauthorized");
    }

    task.setCompleted(true);
    task.setCompletedAt(LocalDateTime.now());
    return taskRepo.save(task);
  }
}

