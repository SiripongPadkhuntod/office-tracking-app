// src/services/authService.js
import api from './api';

const authService = {
  // Register new user
  register: (userData) => {
    return api.post('/auth/register', userData);
  },
  
  // Login user
  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },
  
  // Get user profile
  getProfile: () => {
    // api.get('/auth/profile')
    //   .then((response) => {
    //     return response.data.data;
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching profile:', error);
    //     throw error;
    //   });


    return api.get('/auth/profile');
  }
};

export default authService;