package com.chronos.portal.repository;

import com.chronos.portal.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByTeamId(UUID teamId);
    List<Submission> findByTeamIdAndCheckpointId(UUID teamId, String checkpointId);
    Optional<Submission> findFirstByTeamIdAndCheckpointIdAndIsCorrectTrue(UUID teamId, String checkpointId);
    int countByTeamIdAndCheckpointId(UUID teamId, String checkpointId);
    List<Submission> findTop100ByOrderBySubmittedAtDesc();
}
