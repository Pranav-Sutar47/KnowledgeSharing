import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const API_URL = `${API_BASE_URL}/doubt`;

class CommentService {
  async addComment(materialId, content) {
    try {
      // Get current user info to include in comment
      const userName = localStorage.getItem('name') || 'Anonymous';
      const userEmail = localStorage.getItem('email') || '';
      const userBranch = localStorage.getItem('branch') || '';
      const userYear = localStorage.getItem('year') || '';
      
      const response = await axios.post(`${API_URL}/add`, {
        materialId,
        content,
        // Include user info in the request if the API supports it
        author: {
          name: userName,
          email: userEmail,
          branch: userBranch,
          year: userYear
        }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add comment' 
      };
    }
  }

  async replyToComment(doubtId, content) {
    try {
      const response = await axios.post(`${API_URL}/reply`, 
        { content },
        { params: { doubtId } }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to reply to comment' 
      };
    }
  }

  async getComments(materialId) {
    try {
      const response = await axios.get(`${API_URL}/get`, {
        params: { materialId }
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch comments' 
      };
    }
  }
}

export default new CommentService();