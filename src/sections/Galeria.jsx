import { useEffect, useRef } from 'react';
import useRevealOnScroll from '../hooks/useRevealOnScroll';

/**
 * Lista estática de bloques para la galería.
 * - En móvil: layout de 1 columna con imágenes proporcionales, sin parallax.
 * - En escritorio: layout editorial con col/row-span y efecto parallax.
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

  // Efecto parallax solo en desktop
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isDesktop = window.innerWidth >= 768;

      if (!isDesktop) {
        // Reset transform en mobile por si se hizo resize desde desktop
        itemsRef.current.forEach((el, index) => {
          if (el && !bloques[index].blank) {
            el.style.transform = 'translateY(0px)';
          }
        });
        return;
      }

      itemsRef.current.forEach((el, index) => {
        if (el && !bloques[index].blank) {
          const depth = (index % 3 + 1) * 4;
          el.style.transform = `translateY(${scrollY * depth * 0.0015}px)`;
        }
      });
    };

    // Listener para scroll
    window.addEventListener('scroll', handleScroll, { passive: true });

    // También actualiza al hacer resize
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section
      id="galeria"
      ref={galeriaRef}
      className="pt-16 pb-4 px-6 md:px-20 bg-white"
    >
      <div className="w-full px-4 md:px-8">
        {/* Grid responsive */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-auto md:auto-rows-[160px] gap-4">
          {bloques.map((item, index) => {
            const commonClasses = `transition-transform duration-300 reveal ${item.span}`;

            // Bloques vacíos
            if (item.blank) {
              return (
                <div
                  key={index}
                  className={`bg-transparent ${commonClasses} p-0 m-0`}
                  style={{ willChange: 'transform' }}
                  ref={(el) => (itemsRef.current[index] = el)}
                />
              );
            }

            // Bloques con imagen
            return (
              <div
                key={index}
                ref={(el) => (itemsRef.current[index] = el)}
                className={`relative overflow-hidden shadow-md hover:scale-[1.03] transition duration-300 ease-in-out ${commonClasses} aspect-[4/3] md:aspect-auto`}
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