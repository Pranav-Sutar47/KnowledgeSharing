import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1/user',
  withCredentials: true, // Important for handling cookies
});

export default axiosInstance;
