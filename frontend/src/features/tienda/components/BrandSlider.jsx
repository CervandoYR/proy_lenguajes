export default function BrandSlider() {
  const BRANDS = [
    { name: "ASUS ROG", url: "https://cdn.simpleicons.org/asus/ffffff" },
    { name: "Intel", url: "https://cdn.simpleicons.org/intel/ffffff" },
    { name: "AMD", url: "https://cdn.simpleicons.org/amd/ffffff" },
    { name: "NVIDIA", url: "https://cdn.simpleicons.org/nvidia/ffffff" },
    { name: "Logitech G", url: "https://cdn.simpleicons.org/logitech/ffffff" },
    { name: "Razer", url: "https://cdn.simpleicons.org/razer/ffffff" },
    { name: "Corsair", url: "https://cdn.simpleicons.org/corsair/ffffff" },
    { name: "HP", url: "https://cdn.simpleicons.org/hp/ffffff" },
  ];

  return (
    <div className="w-full bg-surface-900 border-y border-surface-800 py-10 overflow-hidden relative">
      {/* Gradients para efecto de desvanecimiento a los lados */}
      <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-surface-900 to-transparent z-10" />
      <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-surface-900 to-transparent z-10" />

      <div className="flex w-max animate-slide gap-16 items-center px-8">
        {/* Primera copia */}
        {BRANDS.map((brand, i) => (
          <div key={`brand-1-${i}`} className="w-40 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <img src={brand.url} alt={brand.name} className="max-h-12 w-auto object-contain" />
          </div>
        ))}
        {/* Segunda copia para el scroll infinito suave */}
        {BRANDS.map((brand, i) => (
          <div key={`brand-2-${i}`} className="w-40 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <img src={brand.url} alt={brand.name} className="max-h-12 w-auto object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}
