import StoreLayout from "../layouts/StoreLayout";
import { Shield, Zap, Target, Award, MonitorPlay, Cpu } from "lucide-react";
import { useState, useEffect, useRef } from "react";

function AnimatedCounter({ end, suffix = "", prefix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime = null;
          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            // Ease out quad
            const easeOut = progress * (2 - progress);
            setCount(Math.floor(easeOut * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [end, duration]);

  // Formato para miles si es necesario
  const formattedCount = count >= 1000 ? (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1) + "K" : count;

  return (
    <span ref={ref}>
      {prefix}{formattedCount}{suffix}
    </span>
  );
}

export default function AboutUs() {
  return (
    <StoreLayout>
      <div className="relative bg-surface-950 min-h-screen overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-500/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

        <div className="py-24 relative z-10">
          <div className="container-custom max-w-7xl mx-auto">
            {/* Minimalist Hero */}
            <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <h1 className="text-6xl md:text-8xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-surface-400 mb-6 tracking-tighter">
                Servitek.
              </h1>
              <p className="text-xl md:text-2xl text-brand-400 font-light tracking-wide">
                Arquitectos del alto rendimiento.
              </p>
            </div>

            {/* Interactive Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 h-auto md:h-[800px]">
              
              {/* Tile 1: Mision (Large) */}
              <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-[2rem] bg-surface-900 border border-white/5 transition-all duration-700 hover:border-brand-500/30">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-10 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="w-14 h-14 bg-brand-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                    <Target className="w-7 h-7 text-brand-400" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white mb-4">La Misión</h2>
                  <p className="text-surface-300 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 leading-relaxed max-w-md">
                    No armamos computadoras; forjamos herramientas sin límites. Hardware extremo para quienes no aceptan cuellos de botella en su creatividad o en su gaming.
                  </p>
                </div>
              </div>

              {/* Tile 2: Rendimiento */}
              <div className="md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-surface-800 to-surface-900 border border-white/5 transition-all hover:-translate-y-2 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]">
                <div className="p-8 h-full flex flex-col justify-between relative z-10">
                  <Zap className="w-10 h-10 text-brand-400 mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 font-display">
                      <AnimatedCounter end={240} suffix="+" /> FPS
                    </h3>
                    <div className="h-0 overflow-hidden group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-surface-400 text-sm mt-2">Optimizamos cada ensamble al extremo.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tile 3: Stats */}
              <div className="md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-[2rem] bg-brand-500 border border-brand-400 flex items-center justify-center hover:bg-brand-400 transition-colors">
                <div className="text-center p-8">
                  <span className="block text-5xl font-display font-black text-white mb-2 group-hover:scale-110 transition-transform">
                    <AnimatedCounter end={5000} prefix="+" duration={2500} />
                  </span>
                  <span className="text-brand-100 font-medium tracking-widest text-sm uppercase">Equipos Armados</span>
                </div>
              </div>

              {/* Tile 4: Hardware */}
              <div className="md:col-span-2 md:row-span-1 group relative overflow-hidden rounded-[2rem] bg-surface-900 border border-white/5 p-8 flex items-center gap-8 hover:border-purple-500/30 transition-colors">
                <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
                  <Cpu className="w-10 h-10 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Hardware Elite</h3>
                  <p className="text-surface-400">Trabajamos exclusivamente con piezas Tier-A. Nada de componentes genericos.</p>
                </div>
              </div>

              {/* Tile 5: Garantía */}
              <div className="md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-[2rem] bg-surface-900 border border-white/5 p-8 flex flex-col justify-between hover:border-emerald-500/30 transition-all hover:-translate-y-2">
                <Shield className="w-10 h-10 text-emerald-400 mb-4 transform group-hover:scale-125 transition-transform duration-500" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Garantía VIP</h3>
                  <div className="h-0 overflow-hidden group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-surface-400 text-sm mt-2">Soporte directo de ingenieros.</p>
                  </div>
                </div>
              </div>

              {/* Tile 6: Estetica */}
              <div className="md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-[2rem] bg-surface-900 border border-white/5 p-8 flex flex-col justify-between hover:border-pink-500/30 transition-all hover:-translate-y-2">
                <MonitorPlay className="w-10 h-10 text-pink-400 mb-4 transform group-hover:scale-125 transition-transform duration-500" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Cables Perfectos</h3>
                  <div className="h-0 overflow-hidden group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-surface-400 text-sm mt-2">Cable management nivel arte.</p>
                  </div>
                </div>
              </div>

              {/* Tile 7: Envios (Fills the empty space below Hardware Elite) */}
              <div className="md:col-span-2 md:row-span-1 group relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-brand-500/10 to-purple-500/10 border border-white/5 p-8 flex flex-col justify-center hover:border-brand-500/30 transition-colors">
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-surface-900 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-brand-500/50 transition-colors">
                    <svg className="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Envíos a todo el Perú</h3>
                    <p className="text-surface-400 text-sm">Empaque blindado anti-golpes. Tu PC llega impecable sin importar la distancia.</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                  <svg className="w-32 h-32 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
