import { useEffect } from 'react';

/**
 * Hook que activa animaciones `reveal` cuando los elementos entran al viewport.
 * Además:
 * - Elimina `reveal-active` al salir del viewport (reinicio individual).
 * - Reinicia todas las animaciones si el Hero vuelve a pantalla.
 */
export default function useRevealOnScroll() {
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
          } else {
            entry.target.classList.remove('reveal-active'); // Reinicia al salir
          }
        });
      },
      { threshold: 0.2 }
    );

    revealElements.forEach((el) => observer.observe(el));

    // Reiniciar todo si Hero vuelve al viewport
    const hero = document.getElementById('hero');
    const resetAnimations = () => {
      revealElements.forEach((el) => {
        if (el.id !== 'hero') {
          el.classList.remove('reveal-active');
        }
      });
    };

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          resetAnimations();
        }
      },
      { threshold: 0.8 }
    );

    if (hero) heroObserver.observe(hero);

    // Cleanup seguro
    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
      if (hero) heroObserver.disconnect();
    };
  }, []);
}