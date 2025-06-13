import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';

/**
 * LocationMap.jsx
 *
 * Mapa con integración de Google Maps.
 * - En móvil: al tocar cualquier parte del mapa → abre Google Maps.
 * - En escritorio: mapa interactivo con marcador.
 */
export function LocationMap() {
  const { t } = useTranslation();
  const mapRef = useRef(null);

  const center = {
    lat: 19.4378395,
    lng: -99.195948,
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Redirigir en móviles al tocar el contenedor
  const handleMapTouch = () => {
    if (window.innerWidth < 768) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`,
        '_blank'
      );
    }
  };

  if (!isLoaded) {
    return (
      <div className="text-center text-gray-500 py-20 italic">
        {t('reserva.cargandoMapa') || 'Cargando mapa...'}
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-[400px] overflow-hidden shadow-lg rounded-none"
      onClick={handleMapTouch}
    >
      <GoogleMap
        center={center}
        zoom={16}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        onLoad={(map) => (mapRef.current = map)}
        options={{
          gestureHandling: 'auto',
          clickableIcons: false,
          disableDefaultUI: true,
        }}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
}