package com.lelin.tomato.repository;

import com.lelin.tomato.model.Tomato;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TomatoRepository extends JpaRepository<Tomato, Long> {

  long countByUserId(Long userId);

  List<Tomato> findByUserIdOrderByTimestampDesc(Long userId);
}
