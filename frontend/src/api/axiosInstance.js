import axios from 'axios';
import useAuthStore from '../stores/authStore';

const baseURL = process.env.REACT_APP_BACKEND_URL || '/';

const axiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
});

let refreshPromise = null;

const refreshSession = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post('/api/auth/refresh-token')
      .then((response) => {
        useAuthStore.getState().setSession(response.data);
        return response.data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { accessToken, clearSession } = useAuthStore.getState();

    if (
      error.response?.status === 401 &&
      accessToken &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest._skipAuthRefresh
    ) {
      originalRequest._retry = true;
      try {
        const nextAccessToken = await refreshSession();
        originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (_refreshError) {
        clearSession();
      }
    }

    return Promise.reject(error);
  }
);

export { refreshClient };
export default axiosInstance;
