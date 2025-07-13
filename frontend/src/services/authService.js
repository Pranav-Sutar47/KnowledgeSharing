import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const API_URL = `${API_BASE_URL}/user`;

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.setupInterceptors();
  }

  setupInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });
      
      if (response.data.success) {
        const { accessToken, role, name, email: userEmail, branch, year } = response.data.data;
        const userData = response.data.data;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('role', role);
        localStorage.setItem('name', name || userData.name || '');
        localStorage.setItem('email', userEmail || userData.email || email);
        localStorage.setItem('branch', branch || userData.branch || '');
        localStorage.setItem('year', year || userData.year || '');
        this.token = accessToken;
        return { success: true, data: response.data.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  }

  async signup(userData) {
    try {
      const response = await axios.post(`${API_URL}/signup`, userData);
      
      if (response.data.success) {
        // Store user data from signup response
        const userData = response.data.data.user;
        const token = response.data.data.accessToken;
        
        // Store all user information
        localStorage.setItem('token', token);
        localStorage.setItem('role', userData.role);
        localStorage.setItem('name', userData.name);
        localStorage.setItem('email', userData.email);
        localStorage.setItem('branch', userData.branch || '');
        localStorage.setItem('year', userData.year || '');
        
        this.token = token;
        return { success: true, data: response.data.data };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed' 
      };
    }
  }

  async logout() {
    try {
      await axios.get(`${API_URL}/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('branch');
      localStorage.removeItem('year');
      this.token = null;
      window.location.href = '/login';
    }
  }

  async refreshToken() {
    try {
      const response = await axios.post(`${API_URL}/refresh`);
      if (response.data.success) {
        const { accessToken } = response.data.data;
        localStorage.setItem('token', accessToken);
        this.token = accessToken;
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  getCurrentUser() {
    return {
      token: this.token,
      role: localStorage.getItem('role'),
      name: localStorage.getItem('name'),
      email: localStorage.getItem('email'),
      branch: localStorage.getItem('branch'),
      year: localStorage.getItem('year')
    };
  }

  isAuthenticated() {
    return !!this.token;
  }

  getRole() {
    return localStorage.getItem('role');
  }
}

export default new AuthService();