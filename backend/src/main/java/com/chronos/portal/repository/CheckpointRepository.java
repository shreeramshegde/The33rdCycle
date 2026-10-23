package com.chronos.portal.repository;

import com.chronos.portal.entity.Checkpoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CheckpointRepository extends JpaRepository<Checkpoint, String> {
    List<Checkpoint> findAllByOrderByOrderIndexAsc();
    List<Checkpoint> findByIsActiveTrueOrderByOrderIndexAsc();
}
