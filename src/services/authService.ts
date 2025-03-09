import axios from 'axios';

// const API_URL = 'https://interview.optimavaluepro.com/api/v1';
const API_URL = 'http://localhost:5000/api/auth';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  contact: string;
  postcode: string;
  gender: string;
  role: string;
  hobbies: string[];
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await axios.post(`${API_URL}/login`, credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return { token, user };
  },

  async register(data: RegisterData) {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  },

  async logout() {
    const token = localStorage.getItem('token');
    await axios.post(`${API_URL}/logout`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}; 