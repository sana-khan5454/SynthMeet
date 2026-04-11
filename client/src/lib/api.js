import axios from 'axios';

const fallbackBaseUrl = import.meta.env.DEV ? 'http://localhost:5000' : '';

export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || fallbackBaseUrl).replace(/\/$/, '');

const api = axios.create({
  baseURL: apiBaseUrl ? `${apiBaseUrl}/api` : '/api',
});

export default api;
