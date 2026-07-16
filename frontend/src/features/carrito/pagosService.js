import axiosClient from "../../api/axiosClient";

export const procesarPago = ({ token, amount, email, orderId }) =>
  axiosClient
    .post("/pagos/procesar", { token, amount, email, orderId })
    .then((r) => r.data);
