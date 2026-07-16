import axiosClient from "../../api/axiosClient";

export const getProductos = () =>
  axiosClient.get("/productos").then((r) => r.data);

export const getProductoById = (id) =>
  axiosClient.get(`/productos/${id}`).then((r) => r.data);

export const getProductosPorCategoria = (categoriaId) =>
  axiosClient.get(`/productos/categoria/${categoriaId}`).then((r) => r.data);

export const createProducto = (payload) =>
  axiosClient.post("/productos", payload).then((r) => r.data);

export const updateProducto = (id, payload) =>
  axiosClient.put(`/productos/${id}`, payload).then((r) => r.data);

export const deleteProducto = (id) =>
  axiosClient.delete(`/productos/${id}`).then((r) => r.data);

export const uploadMedia = (formData) =>
  axiosClient
    .post("/media/upload", formData, {
      headers: { "Content-Type": undefined },
    })
    .then((r) => r.data);
