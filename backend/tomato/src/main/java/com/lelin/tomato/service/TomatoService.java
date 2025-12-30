package com.lelin.tomato.service;

import com.lelin.tomato.model.Tomato;
import com.lelin.tomato.repository.TomatoRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TomatoService {

  private final TomatoRepository tomatoRepo;

  public Tomato addTomato(Long userId, Long taskId) {
    Tomato t = Tomato.builder()
        .userId(userId)
        .taskId(taskId)
        .timestamp(LocalDateTime.now())
        .build();
    return tomatoRepo.save(t);
  }

  public long getTomatoCount(Long userId) {
    return tomatoRepo.countByUserId(userId);
  }

  public List<Tomato> getTomatoHistory(Long userId) {
    return tomatoRepo.findByUserIdOrderByTimestampDesc(userId);
  }

  @Transactional
  public void removeTomatoForTask(Long userId, Long taskId) {
    tomatoRepo.deleteByUserIdAndTaskId(userId, taskId);
  }
}
