import { Phone } from "lucide-react";
import { useState, useEffect } from "react";

export default function WhatsAppButton() {
  const [isHidden, setIsHidden] = useState(false);
  const WHATSAPP_NUMBER = "+51999999999";
  const MESSAGE = "Hola Servitek, necesito asesoria para comprar un equipo.";

  useEffect(() => {
    const handleToggle = (e) => {
      setIsHidden(e.detail?.isOpen || false);
    };
    window.addEventListener("chatbot-toggle", handleToggle);
    return () => window.removeEventListener("chatbot-toggle", handleToggle);
  }, []);

  const waLink = `https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-5 left-5 sm:bottom-6 sm:left-6 w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#1ebd5a] rounded-full shadow-lg shadow-[#25D366]/30 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-40 animate-pulse ${
        isHidden ? "opacity-0 pointer-events-none translate-y-10 scale-50" : "opacity-100 translate-y-0 scale-100"
      }`}
      title="Contactar por WhatsApp"
      aria-label="Contactar por WhatsApp"
    >
      <Phone className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
    </a>
  );
}
