import { useEffect } from "react";
import useAuthStore from "../auth/authStore";
import { useCart } from "./CartContext";
import { crearPedido } from "../pedidos/pedidosService";
import { procesarPago } from "./pagosService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function useCulqiCheckout() {
  const { user, isAuthenticated } = useAuthStore();
  const { cartTotal, items, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Clave para configurar culqi en ambiente de integración de pruebas
    if (window.Culqi) {
      window.Culqi.publicKey = import.meta.env.VITE_CULQI_PUBLIC_KEY || "pk_test_a04104d557348981";
      window.Culqi.options({
        lang: "es",
        installments: false,
        paymentMethods: {
          tarjeta: true,
          yape: false,
          bancaMovil: false,
          agente: false,
          cuotealo: false,
        },
      });
    }

    // Funcion global que Culqi llamara al generar el token
    window.culqi = async function () {
      if (window.Culqi.token) {
        const token = window.Culqi.token.id;

        try {
          // 1. Crear el pedido
          const orderPayload = {
            subtotal: cartTotal,
            total: cartTotal,
            detalles: items.map(item => ({
              producto: { id: item.product.id },
              cantidad: item.quantity,
              precioUnitario: item.product.precio,
              subtotal: item.product.precio * item.quantity
            }))
          };

          const order = await crearPedido(orderPayload);
          const orderId = order.id;

          // 2. Enviar el token de Culqi a nuestro backend para hacer el cargo
          await procesarPago({
            token,
            amount: cartTotal,
            email: window.Culqi.token.email || user.email,
            orderId,
          });

          clearCart();
          navigate("/dashboard");
          if (window.Culqi.close) window.Culqi.close();
        } catch (err) {
          const errMsg = err.response?.data?.error || err.response?.data?.mensaje || err.message || "Rechazo de pasarela Culqi";
          toast.error(errMsg);
        }
      } else if (window.Culqi.error) {
        toast.error("Culqi: " + (window.Culqi.error.user_message || window.Culqi.error.message || "Error al tokenizar"));
      }
    };
  }, [user, cartTotal, items, clearCart, navigate]);

  const openCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!window.Culqi) {
      return;
    }

    window.Culqi.settings({
      title: "Servitek Technologies",
      currency: "PEN",
      amount: Math.round(cartTotal * 100), // Culqi usa centimos
    });

    window.Culqi.open();
  };

  return { openCheckout };
}
