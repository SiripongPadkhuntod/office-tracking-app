// src/services/equipmentService.js
import api from './api';

const equipmentService = {
  // Get all equipment
  getAllEquipment: () => {
    return api.get('/equipment');
  },
  
  // Get equipment by id
  getEquipmentById: (id) => {
    return api.get(`/equipment/${id}`);
  },
  
  // Search equipment
  searchEquipment: (query) => {
    return api.get(`/equipment/search?name=${query}`);
  },
  
  // Add new equipment
  addEquipment: (equipmentData) => {
    return api.post('/equipment', equipmentData);
  },
  
  // Update equipment
  updateEquipment: (id, equipmentData) => {
    return api.put(`/equipment/${id}`, equipmentData);
  },
  
  // Delete equipment
  deleteEquipment: (id) => {
    return api.delete(`/equipment/${id}`);
  }
};

export default equipmentService;