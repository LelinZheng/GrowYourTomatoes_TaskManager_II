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

  @Enumerated(EnumType.STRING)
  private ImportanceLevel importance = ImportanceLevel.MEDIUM;

  private boolean completed = false;

  private LocalDateTime createdAt = LocalDateTime.now();

  private LocalDateTime completedAt;

  private LocalDateTime timeBomber;

  @Column(nullable = false)
  private Long userId;
}