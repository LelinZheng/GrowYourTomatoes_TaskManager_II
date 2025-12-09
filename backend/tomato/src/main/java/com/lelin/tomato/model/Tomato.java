package com.lelin.tomato.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tomatoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tomato {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private Long userId;

  @Column(nullable = false)
  private Long taskId;

  @Column(nullable = false)
  private LocalDateTime timestamp = LocalDateTime.now();
}
