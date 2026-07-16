import axiosClient from "../../api/axiosClient";

export const getUsuarios = () =>
  axiosClient.get("/usuarios").then((r) => r.data);

export const updateUsuario = (id, payload) =>
  axiosClient.put(`/usuarios/${id}`, payload).then((r) => r.data);

export const validarPasswordActual = (userId, password) =>
  axiosClient
    .post(`/usuarios/${userId}/validar-password`, { password })
    .then((r) => r.data);
