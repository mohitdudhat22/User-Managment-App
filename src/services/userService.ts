import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configure axios with token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const userService = {
  async getUsers(params = {}) {
    const response = await axios.get(`${API_URL}/users`, {
      headers: getAuthHeader(),
      params
    });
    return response.data;
  },

  async getUserById(id: number) {
    const response = await axios.get(`${API_URL}/users/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async createUser(userData: any) {
    const response = await axios.post(`${API_URL}/users`, userData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async updateUser(id: number, userData: any) {
    const response = await axios.put(`${API_URL}/users/${id}`, userData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async deleteUser(id: number) {
    const response = await axios.delete(`${API_URL}/users/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async deleteMultipleUsers(ids: number[]) {
    const response = await axios.post(`${API_URL}/users/delete-multiple`, { userIds: ids }, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async exportUsers() {
    const response = await axios.get(`${API_URL}/users/export`, {
      headers: getAuthHeader(),
      responseType: 'blob'
    });
    return response.data;
  },

  async exportUsersCSV() {
    const response = await axios.get(`${API_URL}/export/users/csv`, {
      headers: getAuthHeader(),
      responseType: 'blob'
    });
    return response.data;
  },

  async exportUsersExcel() {
    const response = await axios.get(`${API_URL}/export/users/excel`, {
      headers: getAuthHeader(),
      responseType: 'blob'
    });
    return response.data;
  },

  async exportUsersPDF() {
    const response = await axios.get(`${API_URL}/export/users/pdf`, {
      headers: getAuthHeader(),
      responseType: 'blob'
    });
    return response.data;
  }
}; 