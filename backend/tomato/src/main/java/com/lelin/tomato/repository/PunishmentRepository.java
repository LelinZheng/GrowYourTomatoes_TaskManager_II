package com.lelin.tomato.repository;

import com.lelin.tomato.model.Punishment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PunishmentRepository extends JpaRepository<Punishment, Long> {

  List<Punishment> findByUserId(Long userId);

  List<Punishment> findByUserIdAndResolvedFalse(Long userId);

  Optional<Punishment> findFirstByUserIdAndResolvedFalseOrderByCreatedAtAsc(Long userId);
}