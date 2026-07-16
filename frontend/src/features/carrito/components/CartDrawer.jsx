import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ isOpen, onClose }) {
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-surface-950/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-surface-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-brand-400" />
            </div>
            <h2 className="font-display font-bold text-xl text-white">Tu Carrito</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-800 rounded-full transition-colors text-surface-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-surface-400 space-y-6">
              <div className="w-24 h-24 bg-surface-900 border border-surface-800 rounded-full flex items-center justify-center shadow-inner">
                <ShoppingBag className="w-10 h-10 opacity-30 text-slate-300" />
              </div>
              <p className="text-lg font-light">Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="group flex gap-4 p-4 bg-surface-900/50 hover:bg-surface-800/50 rounded-2xl border border-white/5 hover:border-brand-500/30 transition-all duration-300"
                >
                  <div className="w-24 h-24 bg-surface-950 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-white/5">
                    {product.imagenUrl ? (
                      <img
                        src={product.imagenUrl}
                        alt={product.nombre}
                        className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-surface-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-bold text-white truncate mb-1">
                        {product.nombre}
                      </p>
                      <p className="text-xs text-brand-400/80 font-medium tracking-wide uppercase">
                        {product.categoria?.nombre || "Hardware"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-slate-200 font-display font-bold">
                        S/ {Number(product.precio).toFixed(2)}
                      </p>
                      
                      <div className="flex items-center gap-1 bg-surface-950 rounded-lg p-1 border border-white/5">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          disabled={quantity <= 1}
                          className="w-7 h-7 rounded-md bg-surface-800 hover:bg-surface-700 flex items-center justify-center cursor-pointer border-none disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-3 h-3 text-white" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="w-7 h-7 rounded-md bg-surface-800 hover:bg-surface-700 flex items-center justify-center cursor-pointer border-none disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Plus className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="self-start p-2 rounded-lg hover:bg-rose-500/10 hover:text-rose-400 text-surface-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/5 p-6 bg-surface-900/30 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <span className="text-surface-300 font-medium">Subtotal</span>
              <span className="font-display font-black text-3xl text-white tracking-tight">
                S/ {cartTotal.toFixed(2)}
              </span>
            </div>

            <button 
              onClick={() => {
                onClose();
                navigate('/checkout');
              }} 
              className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] hover:-translate-y-1 active:scale-95 cursor-pointer"
            >
              Proceder con el pago
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={clearCart}
              className="w-full mt-4 text-center text-sm font-medium text-surface-500 hover:text-rose-400 transition-colors py-2 active:scale-95 cursor-pointer"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
