package com.lelin.tomato.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  private String description;

  @Builder.Default
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Priority priority = Priority.MEDIUM;

  @Column(nullable = false)
  private LocalDateTime createdAt;

  // Due time for time bomber
  private LocalDateTime dueTime;

  private LocalDateTime completedAt;

  // Has the task missed its dueTime?
  @Column(nullable = false)
  private boolean expired;

  // Whether time bomber should track this
  @Column(nullable = false)
  private boolean timeBombEnabled;

  @Column(nullable = false)
  private boolean completed;

  @Column(nullable = false)
  private Long userId;

  @Column(nullable = false)
  private int tomatoesEarned = 0;
}