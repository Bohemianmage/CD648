import { useEffect, useRef } from 'react';

const center = { lat: 19.4378395, lng: -99.195948 };
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * LocationMap.jsx
 *
 * Muestra un mapa de Google Maps centrado en CD648.
 * - Usa AdvancedMarkerView si está disponible.
 * - Fallback a marcador clásico SVG.
 * - Previene carga doble del script.
 * - Carga con loading=async para evitar warnings.
 */
export default function LocationMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const existingScript = document.querySelector('script[data-google-maps]');

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async`;
      script.async = true;
      script.defer = true;
      script.setAttribute('data-google-maps', 'true');
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      if (window.google?.maps) {
        initMap();
      } else {
        existingScript.addEventListener('load', initMap);
      }
    }

    function initMap() {
      const waitForMapConstructor = () => {
        if (window.google?.maps?.Map) {
          renderMap();
        } else {
          setTimeout(waitForMapConstructor, 100);
        }
      };

      const renderMap = () => {
        requestAnimationFrame(() => {
          mapInstance.current = new window.google.maps.Map(mapRef.current, {
            center,
            zoom: 16,
            // mapId: 'ebd648a2ca8dacfd54033229',
            disableDefaultUI: true,
          });

          // Usar marcador avanzado si existe
          if (window.google.maps.marker?.AdvancedMarkerView) {
            const { AdvancedMarkerView } = window.google.maps.marker;

            new AdvancedMarkerView({
              map: mapInstance.current,
              position: center,
            });

          } else {
            // Fallback clásico con ícono SVG personalizado
            new window.google.maps.Marker({
              position: center,
              map: mapInstance.current,
              icon: {
                url: '/icons/pin.svg',
                scaledSize: new window.google.maps.Size(48, 48),
                anchor: new window.google.maps.Point(24, 48),
              },
            });

          }
        });
      };

      waitForMapConstructor();
    }
  }, []);

  const handleTouch = () => {
    if (window.innerWidth < 768) {
      window.open(`https://www.google.com/maps?q=${center.lat},${center.lng}`, '_blank');
    }
  };

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] overflow-hidden shadow-md"
      onClick={handleTouch}
    />
  );
}