package com.lelin.tomato.controller;

import com.lelin.tomato.model.Task;
import jakarta.validation.Valid;
import com.lelin.tomato.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {

  private final TaskService taskService;

  private Long getLoggedInUserId() {
    return Long.parseLong(SecurityContextHolder.getContext()
        .getAuthentication()
        .getName());
  }

  @PostMapping
  public Task createTask(@Valid @RequestBody Task task) {
    return taskService.createTask(task, getLoggedInUserId());
  }

  @GetMapping
  public List<Task> getTasks() {
    return taskService.getTasks(getLoggedInUserId());
  }

  @PutMapping("/{id}")
  public Task updateTask(@PathVariable Long id, @Valid @RequestBody Task task) {
    return taskService.updateTask(id, task, getLoggedInUserId());
  }

  @PutMapping("/{id}/complete")
  public Task completeTask(@PathVariable Long id) {
    return taskService.completeTask(id, getLoggedInUserId());
  }

  @DeleteMapping("/{id}")
  public void deleteTask(@PathVariable Long id) {
    taskService.deleteTask(id, getLoggedInUserId());
  }
}
