import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getUsuarios, updateUsuario } from "./usuariosService";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (err) {
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const cambiarRol = async (id, usuarioActual) => {
    const nuevoRol = usuarioActual.rol === "ADMIN" ? "CLIENTE" : "ADMIN";
    if (!window.confirm(`¿Seguro que deseas cambiar el rol de ${usuarioActual.nombre} a ${nuevoRol}?`)) return;

    try {
      await updateUsuario(id, { ...usuarioActual, rol: nuevoRol });
      toast.success("Rol actualizado");
      cargar();
    } catch (err) {
      toast.error("Error al actualizar rol");
    }
  };

  return { usuarios, loading, recargar: cargar, cambiarRol };
}
