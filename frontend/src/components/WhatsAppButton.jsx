import { Phone } from "lucide-react";

export default function WhatsAppButton() {
  const WHATSAPP_NUMBER = "+51999999999";
  const MESSAGE = "Hola Servitek, necesito asesoria para comprar un equipo.";

  const waLink = `https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 w-14 h-14 bg-[#25D366] hover:bg-[#1ebd5a] rounded-full shadow-lg shadow-[#25D366]/30 flex items-center justify-center text-white transition-transform hover:scale-110 z-50 animate-pulse"
      title="Contactar por WhatsApp"
    >
      <Phone className="w-7 h-7 fill-current" />
    </a>
  );
}
