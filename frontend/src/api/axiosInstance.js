import axios from 'axios';
import useAuthStore from '../stores/authStore';

const baseURL = process.env.REACT_APP_BACKEND_URL || '/';
const clientOptions = {
  baseURL,
  timeout: 15000,
  withCredentials: true,
};

const axiosInstance = axios.create(clientOptions);
const refreshClient = axios.create(clientOptions);
const csrfClient = axios.create(clientOptions);

const SAFE_METHODS = new Set(['get', 'head', 'options']);
let refreshPromise = null;
let csrfToken = null;
let csrfPromise = null;

const getCsrfToken = async () => {
  if (csrfToken) return csrfToken;

  if (!csrfPromise) {
    csrfPromise = csrfClient
      .get('/api/auth/csrf-token')
      .then((response) => {
        csrfToken = response.data.csrfToken;
        return csrfToken;
      })
      .finally(() => {
        csrfPromise = null;
      });
  }

  return csrfPromise;
};

const refreshSession = async () => {
  if (!refreshPromise) {
    refreshPromise = getCsrfToken()
      .then((token) =>
        refreshClient.post(
          '/api/auth/refresh-token',
          {},
          { headers: { 'X-CSRF-Token': token } }
        )
      )
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

axiosInstance.interceptors.request.use(async (requestConfig) => {
  const method = (requestConfig.method || 'get').toLowerCase();
  if (!SAFE_METHODS.has(method)) {
    requestConfig.headers['X-CSRF-Token'] = await getCsrfToken();
  }

  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    requestConfig.headers.Authorization = `Bearer ${accessToken}`;
  }
  return requestConfig;
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

export { refreshClient, getCsrfToken };
export default axiosInstance;
