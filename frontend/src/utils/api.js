import axios from 'axios';

const api = axios.create({
  baseURL: 'https://doppleganger-1dsi.vercel.app/', 
});

api.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem('ee_session');
      if (stored) {
        const session = JSON.parse(stored);
        if (session && session.token) {
          config.headers.Authorization = `Bearer ${session.token}`;
        }
      }
    } catch (err) {
      console.error('Failed to parse token from local storage', err);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
