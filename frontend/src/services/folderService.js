import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const API_URL = `${API_BASE_URL}/folder`;

class FolderService {
  async createFolder(folderData) {
    try {
      const response = await axios.post(`${API_URL}/create`, folderData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create folder' 
      };
    }
  }

  async updateFolder(folderId, folderData) {
    try {
      const response = await axios.put(`${API_URL}/update`, folderData, {
        params: { id: folderId }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update folder' 
      };
    }
  }

  async removeFolder(folderId) {
    try {
      const response = await axios.delete(`${API_URL}/remove`, {
        params: { folderId }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove folder' 
      };
    }
  }
}

export default new FolderService();