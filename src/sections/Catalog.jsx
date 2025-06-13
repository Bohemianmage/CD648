import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bath,
  BedDouble,
  Layout,
  Utensils,
  Coffee,
  Landmark,
  MountainSnow,
  Sofa,
  Binoculars,
  Wifi,
  Laptop,
} from 'lucide-react';
import ImageCarouselModal from '../components/ImageCarouselModal';
import useRevealOnScroll from '../hooks/useRevealOnScroll';

/**
 * CatalogSection.jsx
 *
 * Muestra las habitaciones con diseño vertical moderno:
 * - Imagen arriba
 * - Nombre (izquierda)
 * - Amenidades con íconos (centro)
 * - Botón "Reservar" (derecha)
 * - Reveal animado al hacer scroll
 */
export function CatalogSection({ habitaciones, onReserveRoom }) {
  useRevealOnScroll();
  const { t } = useTranslation();
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselImages, setCarouselImages] = useState([]);

  const handleOpenCarousel = (images) => {
    setCarouselImages(images);
    setCarouselOpen(true);
  };

  // Mapea íconos según amenidad
  function getAmenityIcon(nombre, color = '#9c968b') {
    const lower = nombre.toLowerCase();
    const props = { className: 'w-4 h-4 align-middle', color };

    if (lower.includes('bath')) return <Bath {...props} />;
    if (lower.includes('king') || lower.includes('double bed')) return <BedDouble {...props} />;
    if (lower.includes('closet')) return <Layout {...props} />;
    if (lower.includes('kitchen')) return <Utensils {...props} />;
    if (lower.includes('breakfast')) return <Coffee {...props} />;
    if (lower.includes('terrace')) return <Landmark {...props} />;
    if (lower.includes('living')) return <Sofa {...props} />;
    if (lower.includes('panoramic')) return <Binoculars {...props} />;
    if (lower.includes('wifi') || lower.includes('wi-fi')) return <Wifi {...props} />;
    if (lower.includes('desk') || lower.includes('work')) return <Laptop {...props} />;
    return null;
  }

  return (
    <section
      id="catalog"
      className="py-12 px-4 sm:px-6 md:px-20 bg-white text-[#1c1c1c]"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        {habitaciones.map((habitacion, idx) => (
          <div
            key={habitacion.id}
            className="flex flex-col items-start gap-6 reveal opacity-0 translate-y-8 transition-all duration-700 ease-out"
	    style={{ transitionDelay: `${idx * 100}ms` }}
          >
            {/* Imagen superior */}
            <img
              src={habitacion.imagen}
              alt={habitacion.nombre}
              className="w-full h-64 object-cover rounded-none shadow cursor-pointer transition-transform hover:scale-105"
              onClick={() =>
                handleOpenCarousel(habitacion.imagenes || [habitacion.imagen])
              }
            />

            {/* Sección inferior */}
            <div className="flex flex-col sm:flex-row w-full justify-between items-start gap-6">
              {/* Título */}
              <div className="w-full sm:w-1/4 text-left flex flex-col">
                <h3 className="text-xl sm:text-2xl font-bold tracking-wide uppercase text-[#1c1c1c] mb-2">
                  {habitacion.nombre}
                </h3>
              </div>

              {/* Amenidades */}
              <div className="w-full sm:w-2/4 flex flex-col gap-y-2 text-sm text-gray-700">
                {(habitacion.amenidades?.length ?? 0) > 0 ? (
                  habitacion.amenidades.map((amenidad, i) => (
                    <div
                      key={amenidad + i}
                      className="inline-flex items-center gap-2 h-5 leading-5 align-middle"
                    >
                      <span className="inline-flex items-center">
                        {getAmenityIcon(amenidad)}
                      </span>
                      <span className="text-[13px] text-gray-600">{amenidad}</span>
                    </div>
                  ))
                ) : (
                  <span className="italic text-gray-400">
                    {t('catalog.noAmenities', 'Sin amenidades')}
                  </span>
                )}
              </div>

              {/* Botón */}
              <div className="w-full sm:w-1/4 flex justify-end sm:self-start mt-1">
                <button
                  onClick={() => onReserveRoom(habitacion)}
                  className="border border-black px-5 py-2 rounded-full text-sm font-medium hover:bg-black hover:text-white transition-all"
                >
                  {t('catalog.book', 'Reservar')}
                </button>
              </div>
            </div>

            {/* Línea divisoria entre habitaciones */}
            {idx !== habitaciones.length - 1 && (
              <hr className="border-t border-gray-200 my-12 w-full" />
            )}
          </div>
        ))}
      </div>

      {/* Modal carrusel */}
      <ImageCarouselModal
        isOpen={carouselOpen}
        images={carouselImages}
        onClose={() => setCarouselOpen(false)}
      />
    </section>
  );
}