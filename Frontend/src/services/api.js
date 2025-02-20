// src/services/api.js
import axios from 'axios';
import { auth } from '../Component/firebase';
// import { server } from '../main';

const server = "http://localhost:5000/api/";
const api = axios.create({
  baseURL: server
});

api.interceptors.request.use(
  async (config) => {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;