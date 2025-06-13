import { useEffect, useRef } from 'react';
import useRevealOnScroll from '../hooks/useRevealOnScroll';

/**
 * Lista estática de bloques para la galería.
 * - Las clases md:col-span y md:row-span aplican solo en escritorio.
 * - En móvil se muestra una grilla de 1 columna sin solapamientos.
 */
const bloques = [
  { src: '/img/junior1.jpg', span: 'md:col-span-2 md:row-span-2' },
  { blank: true, span: 'hidden md:block' },
  { src: '/img/master1.jpg', span: '' },
  { src: '/img/balcony1.jpg', span: 'md:row-span-2' },
  { blank: true, span: 'hidden md:block md:col-span-2' },
  { src: '/img/junior2.jpg', span: '' },
  { src: '/img/master2.jpg', span: 'md:col-span-2' },
  { src: '/img/balcony2.jpg', span: '' },
  { blank: true, span: 'hidden md:block' },
];

export function Galeria() {
  const galeriaRef = useRef(null);
  const itemsRef = useRef([]);

  // Hook para animaciones reveal
  useRevealOnScroll();

  // Efecto parallax sutil
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      itemsRef.current.forEach((el, index) => {
        if (el && !bloques[index].blank) {
          const depth = (index % 3 + 1) * 4;
          el.style.transform = `translateY(${scrollY * depth * 0.0015}px)`; // más sutil
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="galeria"
      ref={galeriaRef}
      className="pt-16 pb-4 px-6 md:px-20 bg-white"
    >
      <div className="w-full px-4 md:px-8">
        {/* Grid responsive con look más editorial */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[220px] md:auto-rows-[160px] gap-4">
          {bloques.map((item, index) => {
            const commonClasses = `transition-transform duration-300 reveal ${item.span}`;

            if (item.blank) {
              return (
                <div
                  key={index}
                  className={`bg-transparent ${commonClasses}`}
                  style={{ willChange: 'transform' }}
                  ref={(el) => (itemsRef.current[index] = el)}
                />
              );
            }

            return (
              <div
                key={index}
                ref={(el) => (itemsRef.current[index] = el)}
                className={`overflow-hidden shadow-md hover:scale-[1.03] transition duration-300 ease-in-out ${commonClasses}`}
                style={{ willChange: 'transform' }}
              >
                <img
                  src={item.src}
                  alt={`Galería ${index + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}