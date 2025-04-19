// src/services/api.js
import axios from 'axios';
import { auth } from '../Component/firebase';

const server = "https://event-tracker-emfr.onrender.com/api"; // Removed trailing slash
const api = axios.create({
  baseURL: server,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add debug logging
api.interceptors.request.use(
  async (config) => {
    console.log('Request config before:', config.url);
    
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to request');
    } else {
      console.log('No current user found');
    }
    
    console.log('Final request URL:', `${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    return response;
  },
  (error) => {
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api;