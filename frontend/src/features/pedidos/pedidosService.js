import axiosClient from "../../api/axiosClient";

export const getPedidos = () =>
  axiosClient.get("/pedidos").then((r) => r.data);

export const getMisPedidos = () =>
  axiosClient.get("/pedidos/mis-pedidos").then((r) => r.data);

export const crearPedido = (payload) =>
  axiosClient.post("/pedidos", payload).then((r) => r.data);

export const actualizarEstadoPedido = (id, estado) =>
  axiosClient
    .patch(`/pedidos/${id}/estado?estado=${estado}`)
    .then((r) => r.data);

export const eliminarPedido = (id) =>
  axiosClient.delete(`/pedidos/${id}`).then((r) => r.data);
