import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASEURL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://project-management-server-hees.onrender.com'),
});

export default api;