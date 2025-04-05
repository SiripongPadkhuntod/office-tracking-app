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

    // console.log("query", query);

    if (query.searchType) params.append("searchType", query.searchType);
    if (query.searchTerm) params.append("searchTerm", query.searchTerm);
    if (query.type) params.append("type", query.type);
    if (query.purchaseStartDate && query.purchaseStartDate !== undefined) {
      params.append("startDate", `${query.purchaseStartDate}`);
    }
    if (query.purchaseEndDate && query.purchaseEndDate !== undefined) {
      params.append("endDate", `${query.purchaseEndDate}`);
    }

    if (query.createdStartDate && query.createdStartDate !== undefined) {
      params.append("createdStartDate", `${query.createdStartDate}`);
    }

    if (query.createdEndDate && query.createdEndDate !== undefined) {
      params.append("createdEndDate", `${query.createdEndDate}`);
    }


    // if(query.cre)

    // console.log(`/equipment/search?${params.toString()}`);
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
    return api.put(`/equipment/delect/${id}`);
  }
};

export default equipmentService;