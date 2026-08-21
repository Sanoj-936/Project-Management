import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASEURL || 'https://project-management-server-hees.onrender.com',
});

export default api;