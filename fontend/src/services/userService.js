// src/services/userService.js
import api from './api';

const userService = {
  // Get all users
  getAllUsers: () => {
    return api.get('/users');
  },
  
  // Search users
  searchUsers: (name) => {
    return api.get(`/users/search/${name}`);
  }
};

export default userService;