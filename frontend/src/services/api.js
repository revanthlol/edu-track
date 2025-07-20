// frontend/src/services/api.js
import axios from 'axios';

// This creates a central, configured instance of axios for our entire app.
const api = axios.create({
    // The baseURL is set to '/api'.
    // In local development, vite.config.js proxies this to http://localhost:3001.
    // On Vercel, vercel.json rewrites this to our serverless backend function.
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// This is an interceptor. It's a powerful feature that runs a function
// BEFORE every single request is sent.
api.interceptors.request.use(config => {
    // 1. Get the token from local storage.
    const token = localStorage.getItem('token');
    
    // 2. If the token exists, add the 'Authorization' header to the request.
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 3. Return the modified request config so the request can proceed.
    return config;
});

export default api;