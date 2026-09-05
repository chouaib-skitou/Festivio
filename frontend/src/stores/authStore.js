import create from 'zustand';

const readStoredUser = () => {
  const storedUser = localStorage.getItem('user');

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (_error) {
    localStorage.removeItem('user');
    return null;
  }
};

const setOrRemove = (key, value) => {
  if (value) {
    localStorage.setItem(key, value);
  } else {
    localStorage.removeItem(key);
  }
};

const useAuthStore = create((set) => ({
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  user: readStoredUser(),

  setToken: (accessToken) => {
    setOrRemove('accessToken', accessToken);
    set({ accessToken: accessToken || null });
  },

  setRefreshToken: (refreshToken) => {
    setOrRemove('refreshToken', refreshToken);
    set({ refreshToken: refreshToken || null });
  },

  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }

    set({ user: user || null });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ accessToken: null, refreshToken: null, user: null });
  },
}));

export default useAuthStore;
