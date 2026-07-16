import axiosClient from "../../api/axiosClient";

export async function getDireccionesPorUsuario(usuarioId) {
  try {
    const response = await axiosClient.get(`/direcciones/usuario/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo direcciones del usuario:", error);
    return [];
  }
}

export async function crearDireccion(direccionData) {
  const response = await axiosClient.post("/direcciones", direccionData);
  return response.data;
}

export async function actualizarDireccion(id, direccionData) {
  const response = await axiosClient.put(`/direcciones/${id}`, direccionData);
  return response.data;
}

export async function eliminarDireccion(id) {
  await axiosClient.delete(`/direcciones/${id}`);
  return true;
}
