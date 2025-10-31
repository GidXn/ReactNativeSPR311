import axios from 'axios';
import { getToken } from './auth';

export const api = axios.create({
  baseURL: 'http://10.0.2.2:5165',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


