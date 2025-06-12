import axios from 'axios';

// Vite uses import.meta.env instead of process.env
const primaryUrl = import.meta.env.VITE_API_URL;
const fallbackUrl = 'http://localhost:3000';

const api = axios.create({
  baseURL: primaryUrl || fallbackUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function untuk request dengan fallback manual
export const apiRequest = async (config) => {
  try {
    return await api(config);
  } catch (error) {
    // Jika primary URL ada dan gagal, coba fallback
    if (primaryUrl && 
        (error.code === 'ECONNREFUSED' || 
         error.code === 'ERR_NETWORK' || 
         error.response?.status >= 500)) {
      
      console.log('Primary server failed, trying localhost...');
      
      const fallbackApi = axios.create({
        baseURL: fallbackUrl,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return await fallbackApi(config);
    }
    
    throw error;
  }
};

// Add request interceptor to add token to every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling auth errors
api.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      // Only redirect to login if not already on the login page
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        window.location = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;