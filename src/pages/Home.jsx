import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { Hero } from '../sections/Hero';
import Sobre from '../sections/Sobre';
// import { Cabanas } from '../sections/Cabanas';
import { Galeria } from '../sections/Galeria';
import { Concierge } from '../sections/Concierge'; // ✅ Asegúrate de que Concierge.jsx use `export function`
import { Location } from '../sections/Location';
import useRevealOnScroll from '../hooks/useRevealOnScroll'; // Hook para animaciones

/**
 * Página Home
 *
 * Renderiza las secciones principales del inicio:
 * Hero, Sobre, Galería, Concierge, Ubicación y (futuramente) Cabañas.
 */
export default function Home() {
  const location = useLocation();
  const hasScrolledRef = useRef(false);

  // Activar animaciones reveal al hacer scroll
  useRevealOnScroll();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (hasScrolledRef.current) return;

    const rawScrollTo = sessionStorage.getItem('scrollTo');
    const targetId = rawScrollTo || null;
    let attempts = 0;
    const maxAttempts = 30;

    const tryScroll = () => {
      const el = targetId ? document.getElementById(targetId) : null;
      const header = document.querySelector('header');
      const offset = header?.offsetHeight || 80;

      if (el) {
        setTimeout(() => {
          const rect = el.getBoundingClientRect();
          const scrollTop = window.pageYOffset + rect.top - offset;
          window.scrollTo({ top: scrollTop, behavior: 'smooth' });
          hasScrolledRef.current = true;
          sessionStorage.removeItem('scrollTo');
        }, 300);
      } else if (attempts < maxAttempts) {
        attempts++;
        console.log(`⏳ [Home] Intento ${attempts}: Elemento ${targetId} no encontrado aún...`);
        requestAnimationFrame(tryScroll);
      } else {
        console.warn(`⚠️ [Home] Elemento ${targetId} no se encontró tras ${maxAttempts} intentos.`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        hasScrolledRef.current = true;
        sessionStorage.removeItem('scrollTo');
      }
    };

    if (targetId) tryScroll();
  }, [location]);

  return (
    <Layout>
      {/* ───────────────────────────────────────── */}
      <div id="hero" className="reveal">
        <Hero />
      </div>

      <div id="sobre" className="reveal">
        <Sobre />
      </div>

      <div id="galeria" className="reveal">
        <Galeria />
      </div>

      <div id="concierge" className="reveal">
        <Concierge />
      </div>

      <div id="location" className="reveal">
        <Location />
      </div>

      {/* ───────────────────────────────────────── */}
      {/* Sección Cabañas (opcional) */}
      {/*
      <div id="cabanas" className="reveal">
        <Cabanas />
      </div>
      */}
    </Layout>
  );
}