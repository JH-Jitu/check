// store/store.js
import { create } from "zustand";

const useStore = create((set) => ({
  // State
  user: null,

  // Actions
  setUser: (user) => set({ user }),

  login: (credentials) => {
    // Mock authentication logic
    const isAuthenticated =
      credentials.username === "admin" && credentials.password === "password";
    let mockUser;
    if (isAuthenticated) {
      mockUser = { id: 1, name: "Admin" };
    } else {
      return "error";
    }
    set({ user: mockUser });
  },

  logout: () => set({ user: null }),
}));

export default useStore;
