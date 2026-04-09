import axios from 'axios';

const fallbackBaseUrl = 'http://localhost:5000';

export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || fallbackBaseUrl).replace(/\/$/, '');

const api = axios.create({
  baseURL: `${apiBaseUrl}/api`,
});

export default api;
