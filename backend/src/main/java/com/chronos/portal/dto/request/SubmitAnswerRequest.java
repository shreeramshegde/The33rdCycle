package com.chronos.portal.dto.request;

import jakarta.validation.constraints.NotBlank;

public class SubmitAnswerRequest {

    @NotBlank(message = "Checkpoint ID is required")
    private String checkpointId;

    @NotBlank(message = "Answer string is required")
    private String answer;

    public SubmitAnswerRequest() {
    }

    public SubmitAnswerRequest(String checkpointId, String answer) {
        this.checkpointId = checkpointId;
        this.answer = answer;
    }

    public String getCheckpointId() {
        return checkpointId;
    }

    public void setCheckpointId(String checkpointId) {
        this.checkpointId = checkpointId;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}
