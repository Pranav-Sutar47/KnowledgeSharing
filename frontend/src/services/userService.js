import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const API_URL = `${API_BASE_URL}/user`;

class UserService {
  async getFaculty(page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/get-faculty`, {
        params: { page, limit }
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch faculty' 
      };
    }
  }

  async getStudents(page = 1, limit = 10) {
    try {
      const response = await axios.get(`${API_URL}/get-student`, {
        params: { page, limit }
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch students' 
      };
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await axios.put(`${API_URL}/update`, profileData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update profile' 
      };
    }
  }
}

export default new UserService();