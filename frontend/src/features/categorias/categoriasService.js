import axiosClient from "../../api/axiosClient";

export const getCategorias = () =>
  axiosClient.get("/categorias").then((r) => r.data);

export const createCategoria = (payload) =>
  axiosClient.post("/categorias", payload).then((r) => r.data);

export const updateCategoria = (id, payload) =>
  axiosClient.put(`/categorias/${id}`, payload).then((r) => r.data);

export const deleteCategoria = (id) =>
  axiosClient.delete(`/categorias/${id}`).then((r) => r.data);
