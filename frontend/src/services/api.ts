import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
};

export const profileService = {
  getProfile: (token: string) => api.get('/profile/', { headers: { Authorization: `Bearer ${token}` } }),
  addHistory: (data: any, token: string) => api.post('/profile/add_history', data, { headers: { Authorization: `Bearer ${token}` } }),
};

export const repoService = {
  clone: (repoUrl: string) => api.post('/clone/', { repo_url: repoUrl }),
  index: (repoName: string) => api.get(`/rag/index/${repoName}`),
  chat: (question: string, repoName?: string) => api.post('/rag/chat', { question, repo_name: repoName }),
  search: (query: string) => api.get(`/search/${query}`),
};

export default api;
