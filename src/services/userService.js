import api from './api';

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