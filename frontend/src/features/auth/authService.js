import axiosClient from "../../api/axiosClient";

export const login = (credentials) =>
  axiosClient.post("/auth/login", credentials).then((r) => r.data);

export const register = (data) =>
  axiosClient.post("/auth/register", data).then((r) => r.data);

export const forgotPassword = (email) =>
  axiosClient.post("/auth/forgot-password", { email }).then((r) => r.data);

export const resetPassword = (data) =>
  axiosClient.post("/auth/reset-password", data).then((r) => r.data);
