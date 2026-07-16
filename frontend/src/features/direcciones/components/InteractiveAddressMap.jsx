import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Search, Navigation, Loader2, Sparkles } from "lucide-react";

// Pre-defined popular districts and cities in Peru for 1-click fast centering
const PRESET_LOCATIONS = [
  { label: "Miraflores, Lima", lat: -12.1211, lng: -77.0282, calle: "Av. José Larco", ciudad: "Miraflores", dpto: "Lima" },
  { label: "San Isidro, Lima", lat: -12.0978, lng: -77.0346, calle: "Av. Javier Prado Este", ciudad: "San Isidro", dpto: "Lima" },
  { label: "Santiago de Surco", lat: -12.1384, lng: -76.9931, calle: "Av. Primavera", ciudad: "Santiago de Surco", dpto: "Lima" },
  { label: "Lince, Lima", lat: -12.0833, lng: -77.0333, calle: "Av. Arenales", ciudad: "Lince", dpto: "Lima" },
  { label: "Cercado de Lima", lat: -12.0464, lng: -77.0428, calle: "Av. Garcilaso de la Vega", ciudad: "Cercado de Lima", dpto: "Lima" },
  { label: "Trujillo, La Libertad", lat: -8.1160, lng: -79.0300, calle: "Av. España", ciudad: "Trujillo", dpto: "La Libertad" },
  { label: "Arequipa", lat: -16.3989, lng: -71.5350, calle: "Av. Ejército", ciudad: "Arequipa", dpto: "Arequipa" },
];

export default function InteractiveAddressMap({ 
  initialLat = -12.0464, 
  initialLng = -77.0428, 
  externalStreet = "",
  externalCity = "",
  externalState = "",
  onAddressSelect, 
  heightClass = "h-64 sm:h-72" 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const lastGeocodedQueryRef = useRef("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentCoords, setCurrentCoords] = useState({ lat: initialLat, lng: initialLng });
  const [addressPreview, setAddressPreview] = useState("Selecciona un punto en el mapa o busca tu calle...");

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double init

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    // Add clean Dark/Standard OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Add Zoom control to bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Custom glowing tech icon for marker
    const customIcon = L.divIcon({
      className: "custom-map-pin",
      html: `<div style="
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        border: 3px solid #ffffff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 15px rgba(249, 115, 22, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 10px; height: 10px; background: #ffffff; border-radius: 50%; transform: rotate(45deg);"></div>
      </div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });

    const marker = L.marker([initialLat, initialLng], {
      draggable: true,
      icon: customIcon
    }).addTo(map);

    markerRef.current = marker;
    mapInstanceRef.current = map;

    // Handle marker drag end
    marker.on("dragend", async (e) => {
      const pos = e.target.getLatLng();
      updateMapPosition(pos.lat, pos.lng, true);
    });

    // Handle map click
    map.on("click", async (e) => {
      updateMapPosition(e.latlng.lat, e.latlng.lng, true);
    });

    // Initial reverse geocode if needed
    updateMapPosition(initialLat, initialLng, false);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync map position dynamically if parent loads saved coordinates from API
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      if (initialLat && initialLng && (Math.abs(initialLat - currentCoords.lat) > 0.0001 || Math.abs(initialLng - currentCoords.lng) > 0.0001)) {
        markerRef.current.setLatLng([initialLat, initialLng]);
        mapInstanceRef.current.panTo([initialLat, initialLng]);
        setCurrentCoords({ lat: initialLat, lng: initialLng });
        reverseGeocode(initialLat, initialLng);
      }
    }
  }, [initialLat, initialLng]);

  // Bidirectional Dynamic Sync: When external text inputs (Calle/Ciudad) change below the map
  useEffect(() => {
    if (!externalStreet || externalStreet.trim().length < 4) return;
    const query = `${externalStreet.trim()}, ${externalCity || "Lima"}, ${externalState || "Peru"}`;
    if (query === lastGeocodedQueryRef.current) return;

    const delay = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
          headers: { "Accept-Language": "es" }
        });
        const results = await res.json();
        if (results && results.length > 0) {
          const first = results[0];
          const lat = parseFloat(first.lat);
          const lng = parseFloat(first.lon);
          lastGeocodedQueryRef.current = query;
          if (mapInstanceRef.current && markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
            mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
            setCurrentCoords({ lat, lng });
            setAddressPreview(`${externalStreet}, ${externalCity || ""} - ${externalState || ""}`);
            if (onAddressSelect) {
              onAddressSelect({ latitud: lat, longitud: lng });
            }
          }
        }
      } catch (err) {
        console.error("Bidirectional geocode error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 1200);

    return () => clearTimeout(delay);
  }, [externalStreet, externalCity, externalState]);

  const reverseGeocode = async (lat, lng) => {
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: { "Accept-Language": "es" }
      });
      const data = await res.json();
      
      if (data && data.address) {
        const addr = data.address;
        const calle = addr.road || addr.pedestrian || addr.street || addr.suburb || "Calle principal";
        const nro = addr.house_number ? ` ${addr.house_number}` : "";
        const ciudad = addr.city || addr.town || addr.suburb || addr.neighbourhood || "Lima";
        const dpto = addr.state || addr.region || "Lima";
        const postal = addr.postcode || "15001";
        
        const fullStreet = `${calle}${nro}`;
        const preview = `${fullStreet}, ${ciudad} - ${dpto}`;
        setAddressPreview(preview);

        if (onAddressSelect) {
          onAddressSelect({
            calle: fullStreet,
            ciudad: ciudad,
            departamento: dpto,
            codigoPostal: postal,
            latitud: lat,
            longitud: lng
          });
        }
      } else {
        setAddressPreview(`Ubicación GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        if (onAddressSelect) {
          onAddressSelect({ latitud: lat, longitud: lng });
        }
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      setAddressPreview(`Coordenada GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      if (onAddressSelect) {
        onAddressSelect({ latitud: lat, longitud: lng });
      }
    } finally {
      setIsSearching(false);
    }
  };

  const updateMapPosition = (lat, lng, shouldGeocode = true) => {
    setCurrentCoords({ lat, lng });
    if (markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapInstanceRef.current.panTo([lat, lng]);
    }
    if (shouldGeocode) {
      reverseGeocode(lat, lng);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const q = `${searchQuery.trim()}, Peru`;
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`, {
        headers: { "Accept-Language": "es" }
      });
      const results = await res.json();
      if (results && results.length > 0) {
        const first = results[0];
        const lat = parseFloat(first.lat);
        const lng = parseFloat(first.lon);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
        }
        updateMapPosition(lat, lng, true);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const applyPreset = (preset) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([preset.lat, preset.lng], 16, { duration: 1.2 });
    }
    setCurrentCoords({ lat: preset.lat, lng: preset.lng });
    if (markerRef.current) {
      markerRef.current.setLatLng([preset.lat, preset.lng]);
    }
    const preview = `${preset.calle}, ${preset.ciudad} - ${preset.dpto}`;
    setAddressPreview(preview);
    if (onAddressSelect) {
      onAddressSelect({
        calle: preset.calle,
        ciudad: preset.ciudad,
        departamento: preset.dpto,
        codigoPostal: "15000",
        latitud: preset.lat,
        longitud: preset.lng
      });
    }
  };

  return (
    <div className="space-y-3.5 bg-surface-950/80 border border-surface-800 rounded-2xl p-4 shadow-xl">
      
      {/* Top Bar: Search and Quick Geolocation */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar calle, avenida, distrito o ciudad (ej. Av. Arequipa, Miraflores)..."
            className="w-full bg-surface-900 border border-surface-700/80 rounded-xl pl-10 pr-24 py-2 text-xs sm:text-sm text-slate-100 placeholder-surface-400 focus:outline-none focus:border-brand-500 transition-all shadow-inner"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400 group-focus-within:text-brand-400">
            <Search className="w-4 h-4" />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="absolute inset-y-1 right-1 px-3 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Ubicación 📍</span>}
          </button>
        </form>

        <div className="flex items-center gap-2 shrink-0">
          {externalStreet && (
            <button
              type="button"
              onClick={async () => {
                const query = `${externalStreet.trim()}, ${externalCity || "Lima"}, ${externalState || "Peru"}`;
                setIsSearching(true);
                try {
                  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
                    headers: { "Accept-Language": "es" }
                  });
                  const results = await res.json();
                  if (results && results.length > 0) {
                    const first = results[0];
                    const lat = parseFloat(first.lat);
                    const lng = parseFloat(first.lon);
                    lastGeocodedQueryRef.current = query;
                    if (mapInstanceRef.current && markerRef.current) {
                      markerRef.current.setLatLng([lat, lng]);
                      mapInstanceRef.current.flyTo([lat, lng], 17, { duration: 1.2 });
                      setCurrentCoords({ lat, lng });
                      setAddressPreview(`${externalStreet}, ${externalCity || ""} - ${externalState || ""}`);
                      if (onAddressSelect) {
                        onAddressSelect({ latitud: lat, longitud: lng });
                      }
                    }
                  }
                } catch (err) {
                  console.error(err);
                } finally {
                  setIsSearching(false);
                }
              }}
              className="px-3 py-2 rounded-xl bg-brand-500/15 hover:bg-brand-500/25 border border-brand-500/40 text-brand-400 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer shrink-0"
              title="Centrar mapa en la dirección escrita en el formulario"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Centrar en: "{externalStreet.slice(0, 15)}..."</span>
              <span className="sm:hidden">Centrar Escrito</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (navigator.geolocation) {
                setIsSearching(true);
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    const { latitude, longitude } = pos.coords;
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.flyTo([latitude, longitude], 17, { duration: 1.5 });
                    }
                    updateMapPosition(latitude, longitude, true);
                  },
                  () => {
                    setIsSearching(false);
                    applyPreset(PRESET_LOCATIONS[0]);
                  }
                );
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-surface-800 hover:bg-brand-500/15 border border-surface-700 text-slate-200 hover:text-brand-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer shrink-0"
            title="Usar mi ubicación GPS actual"
          >
            <Navigation className="w-3.5 h-3.5 text-brand-400" />
            <span>Mi GPS</span>
          </button>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400 shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Zonas:</span>
        </span>
        {PRESET_LOCATIONS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => applyPreset(preset)}
            className="px-2.5 py-1 rounded-lg bg-surface-900 hover:bg-brand-500/20 text-surface-300 hover:text-brand-300 text-[11px] font-medium transition-all border border-surface-800 hover:border-brand-500/40 shrink-0 cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Leaflet Map Container */}
      <div className={`relative rounded-2xl overflow-hidden border border-surface-700/80 shadow-inner w-full bg-surface-900 z-10 ${heightClass}`}>
        <div ref={mapContainerRef} className="w-full h-full" />
        
        {/* Floating Instruction Banner inside Map */}
        <div className="absolute top-3 left-3 right-3 z-[1000] bg-surface-950/90 backdrop-blur-md border border-surface-700/80 rounded-xl px-3.5 py-2 shadow-lg flex items-center justify-between gap-3 pointer-events-none">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse shrink-0" />
            <span className="text-xs font-semibold text-slate-100 truncate">
              {isSearching ? "Calculando dirección..." : addressPreview}
            </span>
          </div>
          <span className="text-[10px] font-bold bg-brand-500/15 text-brand-400 px-2 py-0.5 rounded-md shrink-0">
            Arrastra el Pin 📍
          </span>
        </div>
      </div>

      {/* Coords Info footer */}
      <div className="flex items-center justify-between text-[11px] text-surface-400 px-1 font-mono">
        <span>Latitud: {currentCoords.lat.toFixed(6)}</span>
        <span>Longitud: {currentCoords.lng.toFixed(6)}</span>
        <span className="text-emerald-400 font-sans font-bold flex items-center gap-1">
          <span>Sincronización Dinámica Activa</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </span>
      </div>

    </div>
  );
}
