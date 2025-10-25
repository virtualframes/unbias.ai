import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const theoryService = {
  async getTheories() {
    const response = await api.get('/theories');
    return response.data;
  },

  async getTheory(id) {
    const response = await api.get(`/theories/${id}`);
    return response.data;
  },

  async createTheory(data) {
    const response = await api.post('/theories', data);
    return response.data;
  },

  async updateTheory(id, data) {
    const response = await api.put(`/theories/${id}`, data);
    return response.data;
  },

  async deleteTheory(id) {
    const response = await api.delete(`/theories/${id}`);
    return response.data;
  },

  async addCitation(theoryId, data) {
    const response = await api.post(`/theories/${theoryId}/citations`, data);
    return response.data;
  },

  async validateCitation(citationId) {
    const response = await api.post('/citations/validate', { citation_id: citationId });
    return response.data;
  },

  async getAssumptions(theoryId) {
    const response = await api.get(`/theories/${theoryId}/assumptions`);
    return response.data;
  },

  async getContradictions(theoryId) {
    const response = await api.get(`/theories/${theoryId}/contradictions`);
    return response.data;
  },

  async getProvenance(theoryId) {
    const response = await api.get(`/theories/${theoryId}/provenance`);
    return response.data;
  },
};

export default api;
