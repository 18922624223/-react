import axios from 'axios';
import { getToken, removeToken } from './Token';

const service = axios.create({
  baseURL: 'https://api.dda.vyitec.com',
  timeout: 5000
});

service.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      console.log('token', token);
    }
    return config;
  },
  error => Promise.reject(error)
);

service.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
      return Promise.reject(new Error('登录已过期，请重新登录'));
    }
    return Promise.reject(error);
  }
);

export default service;