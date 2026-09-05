import create from 'zustand';

const useAuthStore = create((set) => ({
  accessToken: null,
  user: null,
  hydrated: false,

  setSession: ({ accessToken, user }) =>
    set({
      accessToken: accessToken || null,
      user: user || null,
    }),

  setToken: (accessToken) => set({ accessToken: accessToken || null }),
  setUser: (user) => set({ user: user || null }),
  setHydrated: (hydrated) => set({ hydrated }),

  clearSession: () => set({ accessToken: null, user: null }),
  logout: () => set({ accessToken: null, user: null }),
}));

export default useAuthStore;
