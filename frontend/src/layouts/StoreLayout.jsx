import { useState } from "react";
import Navbar from "../components/Navbar";
import CartDrawer from "../features/carrito/components/CartDrawer";
import Footer from "../components/Footer";
import ChatbotWidget from "../features/chat/components/ChatbotWidget";
import WhatsAppButton from "../components/WhatsAppButton";

export default function StoreLayout({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onCartToggle={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatbotWidget />
      <WhatsAppButton />
    </div>
  );
}
