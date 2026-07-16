import { create } from "zustand";

const useAuthStore = create((set) => {
  const storedUser = localStorage.getItem("user_data");
  const storedToken = localStorage.getItem("jwt_token");

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    isAuthenticated: !!storedToken,

    login: (userData, tokenData) => {
      localStorage.setItem("user_data", JSON.stringify(userData));
      localStorage.setItem("jwt_token", tokenData);
      set({ user: userData, token: tokenData, isAuthenticated: true });
    },

    logout: () => {
      localStorage.removeItem("user_data");
      localStorage.removeItem("jwt_token");
      set({ user: null, token: null, isAuthenticated: false });
    },

    setUser: (userData) => {
      localStorage.setItem("user_data", JSON.stringify(userData));
      set({ user: userData });
    },
  };
});

export default useAuthStore;
