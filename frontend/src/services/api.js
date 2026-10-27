/**
 * CHRONOS API SERVICE
 * Connects to Spring Boot 3.3 Backend
 */

const getApiBaseUrl = () => {
  let url = (import.meta.env.VITE_API_URL || '/api').trim();
  url = url.replace(/\/+$/, '');
  // If user provides full origin without /api, append /api
  if (url.startsWith('http') && !url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const API_BASE_URL = getApiBaseUrl();

export const getStoredToken = () => localStorage.getItem('chronos_token');
export const getStoredRole = () => localStorage.getItem('chronos_role') || 'ROLE_TEAM';
export const getStoredTeam = () => {
  const data = localStorage.getItem('chronos_team');
  return data ? JSON.parse(data) : null;
};

export const setAuthSession = (token, authData) => {
  localStorage.setItem('chronos_token', token);
  const role = authData.role || (authData.identifier === 'admin' ? 'ROLE_ADMIN' : 'ROLE_TEAM');
  localStorage.setItem('chronos_role', role);

  const sanitizedUser = {
    identifier: authData.identifier || authData.teamCode || 'admin',
    displayName: authData.displayName || authData.teamName || 'Admin',
    teamCode: authData.teamCode || authData.identifier,
    teamName: authData.teamName || authData.displayName,
    role,
  };
  localStorage.setItem('chronos_team', JSON.stringify(sanitizedUser));
};

export const clearAuthSession = () => {
  localStorage.removeItem('chronos_token');
  localStorage.removeItem('chronos_team');
  localStorage.removeItem('chronos_role');
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
    const res = await fetch(`${API_BASE_URL}/portal/status`, {
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
    const cleanAnswer = submittedAnswer.trim();
    const res = await fetch(`${API_BASE_URL}/portal/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        checkpointId,
        answer: cleanAnswer,
        submittedAnswer: cleanAnswer,
      }),
    });
    return handleResponse(res);
  },

  // Admin authentication
  async adminLogin(username, password) {
    const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.trim(), password }),
    });
    return handleResponse(res);
  },

  // Admin issue hint penalty (-2 pts)
  async issueHint(teamCode, checkpointId) {
    const token = getStoredToken();
    const res = await fetch(`${API_BASE_URL}/admin/hint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        teamCode: teamCode.trim().toUpperCase(),
        checkpointId: checkpointId.trim().toUpperCase(),
      }),
    });
    return handleResponse(res);
  },

  // Admin get team overview (for team dropdown and current scores)
  async getAdminTeams() {
    const token = getStoredToken();
    const res = await fetch(`${API_BASE_URL}/admin/leaderboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(res);
  },
};
