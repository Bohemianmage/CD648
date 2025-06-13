import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * ImageCarouselModal.jsx
 *
 * Modal centrado con carrusel de imágenes.
 * - Swipe para móviles
 * - Cierre con clic fuera o ESC
 * - Centrado real en pantalla (usa ReactDOM.createPortal)
 * - ScrollLock cuando está abierto
 *
 * Props:
 * - isOpen: boolean
 * - images: string[]
 * - onClose: () => void
 */
export default function ImageCarouselModal({ isOpen, images = [], onClose }) {
  const [current, setCurrent] = useState(0);
  const modalRef = useRef(null);
  const touchStartX = useRef(null);

  const next = () => setCurrent((current + 1) % images.length);
  const prev = () => setCurrent((current - 1 + images.length) % images.length);

  // Scroll lock y eventos
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      document.body.classList.add('overflow-hidden');
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen, current]);

  // Swipe móvil
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) next();
    else if (diff < -50) prev();
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
        <div
          ref={modalRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col justify-center overflow-hidden shadow-xl"
        >
          {/* Imagen */}
          <div className="w-full h-[400px] flex items-center justify-center px-4">
            <img
              src={images[current]}
              alt={`Imagen ${current + 1}`}
              className="max-h-full max-w-full object-contain rounded shadow"
            />
          </div>

          {/* Controles */}
          {images.length > 1 && (
            <div className="flex justify-between items-center mt-4 px-4 pb-4">
              <button
                onClick={prev}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center shadow"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                {current + 1} / {images.length}
              </span>
              <button
                onClick={next}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center shadow"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    ),
    document.body
  );
}
