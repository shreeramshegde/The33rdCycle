package com.chronos.portal.repository;

import com.chronos.portal.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeamRepository extends JpaRepository<Team, UUID> {
    Optional<Team> findByTeamCode(String teamCode);
    boolean existsByTeamCode(String teamCode);
    List<Team> findAllByOrderByTotalScoreDescLastActiveAsc();
}
