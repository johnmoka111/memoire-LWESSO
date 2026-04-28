import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const propertyService = {
  getMissions: async () => {
    const response = await api.get('/agent/missions');
    return response.data;
  },
  validateProperty: async (id: number, panoramaUrl: string) => {
    const response = await api.post(`/agent/validate/${id}`, { panorama_url: panoramaUrl });
    return response.data;
  },
  getOwnerProperties: async () => {
    const response = await api.get('/owner/properties');
    return response.data;
  },
  createProperty: async (data: any) => {
    const response = await api.post('/owner/properties', data);
    return response.data;
  }
};

export default api;
