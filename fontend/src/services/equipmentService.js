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
    const params = new URLSearchParams();

    // if (query.searchType && query.searchTerm != "" ) params.append("searchType", query.searchType);
    if (query.searchTerm) params.append("searchTerm", query.searchTerm);
    if (query.type) params.append("type", query.type);

    // Convert DD/MM/YYYY → YYYY-MM-DD
    if (query.startDate && query.startDate !== undefined) {
        // const [year, month, day] = query.startDate.split('-');
        // params.append("startDate", `${day}-${month}-${year}`);
        params.append("startDate", `${query.startDate}`);
    }
    if (query.endDate && query.endDate !== undefined) {
        // const [year, month, day] = query.endDate.split('-');
        // params.append("endDate", `${day}-${month}-${year}`);
        params.append("endDate", `${query.endDate}`);
    }

    console.log(`/equipment/search?${params.toString()}`);
    return api.get(`/equipment/search?${params.toString()}`);
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