import create from 'zustand';

const useAuthStore = create((set) => ({
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  user: JSON.parse(localStorage.getItem('user')) || null, // Get user data from localStorage

  setToken: (accessToken) => {
    console.log('Setting accessToken:', accessToken);
    localStorage.setItem('accessToken', accessToken);
    set({ accessToken });
  },

  setRefreshToken: (refreshToken) => {
    console.log('Setting refreshToken:', refreshToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ refreshToken });
  },

  setUser: (user) => {
    console.log('Setting user:', user);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    console.log('Logging out');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ accessToken: null, refreshToken: null, user: null });
  },
}));

export default useAuthStore;
