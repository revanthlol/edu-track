// frontend/src/services/api.js
import axios from 'axios';

// The '/api' prefix will be rewritten by vercel.json to point to the backend
const api = axios.create({
    baseURL: '/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;