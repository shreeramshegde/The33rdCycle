/**
 * CHRONOS API SERVICE
 * Connects to Spring Boot 3.3 Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const getStoredToken = () => localStorage.getItem('chronos_token');
export const getStoredTeam = () => {
  const data = localStorage.getItem('chronos_team');
  return data ? JSON.parse(data) : null;
};

export const setAuthSession = (token, teamData) => {
  localStorage.setItem('chronos_token', token);
  localStorage.setItem('chronos_team', JSON.stringify(teamData));
};

export const clearAuthSession = () => {
  localStorage.removeItem('chronos_token');
  localStorage.removeItem('chronos_team');
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    clearAuthSession();
    window.location.reload();
    throw new Error('Session expired. Please log in again.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
};

export const api = {
  // Check backend connection health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch {
      return { status: 'OFFLINE' };
    }
  },

  // Team authentication
  async teamLogin(teamCode, password) {
    const res = await fetch(`${API_BASE_URL}/auth/team/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamCode: teamCode.trim().toUpperCase(), password }),
    });
    return handleResponse(res);
  },

  // Get current team progress and checkpoint statuses
  async getProgress() {
    const token = getStoredToken();
    const res = await fetch(`${API_BASE_URL}/portal/progress`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(res);
  },

  // Submit answer for verification
  async submitAnswer(checkpointId, submittedAnswer) {
    const token = getStoredToken();
    const res = await fetch(`${API_BASE_URL}/portal/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        checkpointId,
        submittedAnswer: submittedAnswer.trim(),
      }),
    });
    return handleResponse(res);
  },
};
