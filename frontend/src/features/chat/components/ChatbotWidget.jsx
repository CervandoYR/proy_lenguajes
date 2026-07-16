import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Minimize2, ExternalLink, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { enviarMensaje } from "../chatService";
import ReactMarkdown from "react-markdown";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(() => {
    return sessionStorage.getItem("servitek_chat_open") === "true";
  });
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem("servitek_chat_messages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [{ role: "assistant", text: "¡Hola! Soy el asistente tecnico de Servitek. ¿En que te puedo ayudar hoy?" }];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    sessionStorage.setItem("servitek_chat_messages", JSON.stringify(messages));
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    sessionStorage.setItem("servitek_chat_open", isOpen.toString());
    if (isOpen) scrollToBottom();
  }, [isOpen]);

  const handleClearChat = () => {
    const initialMsg = [{ role: "assistant", text: "¡Hola! Soy el asistente tecnico de Servitek. ¿En que te puedo ayudar hoy?" }];
    setMessages(initialMsg);
    sessionStorage.setItem("servitek_chat_messages", JSON.stringify(initialMsg));
  };

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      const data = await enviarMensaje(userMsg);
      setMessages((prev) => [...prev, { role: "assistant", text: data.response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", text: "Ocurrio un error al comunicarme con mis sensores. Intenta nuevamente." }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("chatbot-toggle", { detail: { isOpen } })
    );
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 w-13 h-13 sm:w-14 sm:h-14 bg-brand-500 hover:bg-brand-600 rounded-full shadow-lg shadow-brand-500/30 flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 cursor-pointer z-40 animate-bounce-subtle"
        title="Hablar con Servitek AI"
        aria-label="Abrir asistente de Inteligencia Artificial Servitek AI"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 w-full sm:w-[410px] max-h-[88vh] sm:max-h-[82vh] bg-surface-900 border-t sm:border border-surface-700 shadow-2xl rounded-t-3xl sm:rounded-2xl overflow-hidden z-50 flex flex-col animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="bg-surface-800 px-5 py-3.5 border-b border-surface-700 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-brand-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm text-slate-100 leading-tight">Servitek AI</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-[10px] text-surface-400 uppercase tracking-wider font-semibold">Online · Asistente Técnico</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleClearChat} 
            className="p-1.5 text-surface-400 hover:text-rose-400 hover:bg-surface-700 rounded-lg transition-colors cursor-pointer"
            title="Limpiar y reiniciar chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-1.5 text-surface-400 hover:text-slate-200 hover:bg-surface-700 rounded-lg transition-colors cursor-pointer"
            title="Minimizar chat"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-[360px] max-h-[460px] sm:max-h-[440px] overflow-y-auto overflow-x-hidden p-4 space-y-4 bg-surface-900/60 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center mt-0.5 ${m.role === "user" ? "bg-surface-800 border border-surface-700" : "bg-brand-500/20 border border-brand-500/30"}`}>
              {m.role === "user" ? <User className="w-3.5 h-3.5 text-surface-400" /> : <Bot className="w-3.5 h-3.5 text-brand-400" />}
            </div>
            <div className={`px-4 py-3 rounded-2xl max-w-[86%] text-xs sm:text-sm break-words overflow-hidden ${
              m.role === "user" 
                ? "bg-brand-500 text-white rounded-tr-sm shadow-md" 
                : "bg-surface-800/90 border border-surface-700 text-slate-200 rounded-tl-sm shadow-sm"
            }`}>
              {m.role === "assistant" ? (
                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5">
                  <ReactMarkdown
                    components={{
                      a: ({ node, href, children, ...props }) => {
                        const isInternal = href && (href.startsWith("/") || href.includes("servitek"));
                        if (isInternal) {
                          return (
                            <Link
                              to={href}
                              onClick={() => {
                                // Mantenemos el chat en sessionStorage sin borrar nada al navegar
                              }}
                              className="flex items-center justify-between gap-2 px-3 py-2.5 my-2.5 w-full rounded-xl bg-gradient-to-r from-brand-500/20 via-brand-500/10 to-transparent border border-brand-500/40 text-brand-300 font-display font-bold hover:from-brand-500 hover:to-brand-600 hover:text-white hover:border-brand-500 transition-all duration-300 shadow-sm no-underline text-xs group/link cursor-pointer overflow-hidden"
                              {...props}
                            >
                              <span className="flex items-center gap-2 min-w-0 flex-1">
                                <ShoppingBag className="w-4 h-4 text-brand-400 group-hover/link:text-white shrink-0 transition-colors" />
                                <span className="truncate block font-semibold text-xs sm:text-sm">{children}</span>
                              </span>
                              <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider bg-surface-950/80 px-2 py-1 rounded-lg group-hover/link:bg-white/20 transition-colors shrink-0">
                                Ver equipo
                                <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                              </span>
                            </Link>
                          );
                        }
                        return (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-400 hover:text-brand-300 underline font-semibold inline-flex items-center gap-1 break-all"
                            {...props}
                          >
                            {children}
                            <ExternalLink className="w-3 h-3 inline shrink-0" />
                          </a>
                        );
                      }
                    }}
                  >
                    {m.text}
                  </ReactMarkdown>
                </div>
              ) : (
                m.text
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2.5 flex-row">
            <div className="w-7 h-7 shrink-0 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center mt-0.5">
              <Bot className="w-3.5 h-3.5 text-brand-400" />
            </div>
            <div className="bg-surface-800 border border-surface-700 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-surface-800 border-t border-surface-700 shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta por hardware, laptops, armado..."
            className="w-full bg-surface-900 border border-surface-700 text-slate-100 text-xs sm:text-sm rounded-full pl-4 pr-11 py-2.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50 transition-all placeholder:text-surface-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 w-8 h-8 rounded-full bg-brand-500 hover:bg-brand-600 disabled:bg-surface-700 disabled:text-surface-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="Enviar mensaje"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
