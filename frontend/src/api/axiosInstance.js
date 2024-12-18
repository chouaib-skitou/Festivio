import axios from 'axios';
import useAuthStore from '../stores/authStore';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

// Attach access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.error('Access token missing');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized - logging out...");
      const { logout } = useAuthStore.getState();
      logout(); // Clear user data from local storage or store
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
