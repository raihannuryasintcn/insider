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


export const getUsers = async () => {
  try {
    const response = await api.get('/api/users');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to fetch users';
    console.error('Error fetching users:', error);
    throw new Error(errorMessage);
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/api/users', {
      username: userData.username,
      password: userData.password,
      role: userData.role
    });
    return response.data;
  } catch (error) {
    let errorMessage = 'Failed to create user';
    
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response?.status === 400) {
      errorMessage = 'Invalid user data. Please check your input.';
    } else if (error.response?.status === 409) {
      errorMessage = 'Username already exists. Please choose a different username.';
    }
    
    console.error('Error creating user:', error);
    throw new Error(errorMessage);
  }
};

export const updateUser = async (username, userData) => {
  try {
    // Server expects role and optionally password in the body for updates
    const response = await api.put(`/api/users/${username}`, userData);
    return response.data;
  } catch (error) {
    let errorMessage = 'Failed to update user';
    
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response?.status === 404) {
      errorMessage = `User "${username}" not found.`;
    } else if (error.response?.status === 400) {
      errorMessage = 'Invalid update data. Please check your input.';
    }
    
    console.error('Error updating user:', error);
    throw new Error(errorMessage);
  }
};

export const deleteUser = async (username) => {
  try {
    const response = await api.delete(`/api/users/${username}`);
    return response.data;
  } catch (error) {
    let errorMessage = 'Failed to delete user';
    
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response?.status === 404) {
      errorMessage = `User "${username}" not found.`;
    } else if (error.response?.status === 400) {
      errorMessage = 'Cannot delete your own account.';
    }
    
    console.error('Error deleting user:', error);
    throw new Error(errorMessage);
  }
};

export const getActivityLogs = async () => {
  try {
    const response = await api.get('/api/users/logs');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Failed to fetch activity logs';
    console.error('Error fetching activity logs:', error);
    throw new Error(errorMessage);
  }
};