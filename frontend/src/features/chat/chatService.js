import axiosClient from "../../api/axiosClient";

export const enviarMensaje = (message) =>
  axiosClient.post("/chat", { message }).then((r) => r.data);
