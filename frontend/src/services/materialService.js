import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const API_URL = `${API_BASE_URL}/material`;

class MaterialService {
  async addMaterial(formData) {
    try {
      // Log the formData for debugging
      console.log('Uploading material with formData:', formData);
      
      const response = await axios.post(`${API_URL}/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 second timeout for file uploads
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Material upload error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to add material' 
      };
    }
  }

  async updateMaterial(formData) {
    try {
      const response = await axios.post(`${API_URL}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update material' 
      };
    }
  }

  async removeMaterial(materialId) {
    try {
      const response = await axios.delete(`${API_URL}/remove`, {
        data: { materialId }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove material' 
      };
    }
  }

  async removeItem(materialId, itemId) {
    try {
      const response = await axios.delete(`${API_URL}/remove-item`, {
        data: { materialId, itemId }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove item' 
      };
    }
  }

  async getMaterialList() {
    try {
      const response = await axios.get(`${API_URL}/get`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch materials' 
      };
    }
  }

  async getMaterial(id) {
    try {
      const response = await axios.get(`${API_URL}/get-item`, {
        params: { id }
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch material' 
      };
    }
  }

  async getFacultyMaterials(facultyId) {
    try {
      const response = await axios.get(`${API_URL}/get-faculty-material-list`, {
        params: { id: facultyId }
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch faculty materials' 
      };
    }
  }

  async getMaterialsFromFolder(folderId) {
    try {
      console.log('Fetching materials for folder ID:', folderId);
      const response = await axios.get(`${API_URL}/get-material-folder`, {
        params: { folderId }
      });
      console.log('API response:', response.data);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error in getMaterialsFromFolder:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to fetch folder materials' 
      };
    }
  }
}

export default new MaterialService();