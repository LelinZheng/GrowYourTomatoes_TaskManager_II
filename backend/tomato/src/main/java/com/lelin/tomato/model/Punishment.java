package com.lelin.tomato.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "punishments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Punishment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private Long userId;

  // Task that caused this punishment (expired task)
  @Column(nullable = false)
  private Long taskId;

  @Column(nullable = false)
  private LocalDateTime createdAt = LocalDateTime.now();

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private PunishmentType type;

  // false = still owed, true = resolved
  @Column(nullable = false)
  private boolean resolved = false;

  // Which task completion cleared this punishment (optional)
  private Long resolvedByTaskId;
}
