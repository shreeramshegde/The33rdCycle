package com.chronos.portal.dto.response;

public record HintPenaltyResponse(
        boolean success,
        String message,
        String teamCode,
        String teamName,
        String checkpointId,
        int pointsDeducted,
        int updatedTotalScore
) {
}
