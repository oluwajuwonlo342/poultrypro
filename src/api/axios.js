import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('poultrypro_token');
    const activeFarmId = localStorage.getItem('poultrypro_active_farm_id');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (activeFarmId && !config.headers['x-farm-id']) {
      config.headers['x-farm-id'] = activeFarmId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('poultrypro_token');
      if (!window.location.pathname.startsWith('/login') && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;