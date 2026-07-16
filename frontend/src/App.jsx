import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { CartProvider } from "./features/carrito/CartContext";
import ScrollToTop from "./components/ScrollToTop";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <CartProvider>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </CartProvider>
  );
}
