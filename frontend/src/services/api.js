// frontend/src/services/api.js
import axios from 'axios';

// In production, Railway gives us the public URL for our backend.
// In development, this is undefined, so it defaults to the local proxy.
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL });
api.interceptors.request.use(config => { 
    // 1. Get the token from local storage.
    const token = localStorage.getItem('token');
    
    // 2. If the token exists, add the 'Authorization' header to the request.
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 3. Return the modified request config so the request can proceed.
    return config; });
export default api;