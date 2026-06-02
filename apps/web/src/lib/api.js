import axios from 'axios';

// In production, use same-origin proxy (Vercel rewrites /api/* to the API backend)
// This avoids cross-origin cookie issues
const baseURL = import.meta.env.PROD
  ? '/api'  // Same domain proxy in production
  : (import.meta.env.VITE_API_URL || 'http://localhost:3000/api');

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
