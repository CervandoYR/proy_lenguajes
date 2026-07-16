import axiosClient from "../../api/axiosClient";

export const login = (credentials) =>
  axiosClient.post("/auth/login", credentials).then((r) => r.data);

export const register = (data) =>
  axiosClient.post("/auth/register", data).then((r) => r.data);
