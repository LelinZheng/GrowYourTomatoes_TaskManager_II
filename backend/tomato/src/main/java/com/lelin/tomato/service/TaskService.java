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

  private final TaskRepository taskRepository;

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

  public void deleteTask(Long id, Long userId) {
    Task task = taskRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Task not found"));

    if (!task.getUserId().equals(userId)) {
      throw new RuntimeException("Unauthorized");
    }

    taskRepository.delete(task);
  }
}


