import { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from '../sections/Footer';
import WhatsAppButton from './WhatsAppButton';
import { ReservaModal } from './ReservaModal';

/**
 * Componente Layout
 * -----------------
 * Envoltorio global de la aplicación que incluye:
 * - Navbar (fijo arriba)
 * - Un espaciador ("h-24") para despejar el contenido bajo el Navbar
 * - {children} para renderizar cada página (Home, Catalogo, etc.)
 * - Footer, WhatsAppButton y ReservaModal abrazados al final
 *
 * NOTA:
 *   Ya no maneja lógica de scroll, pues esa responsabilidad la absorben
 *   Home.jsx o CatalogoPage.jsx (dependiendo de dónde venga el scroll).
 *
 * Props:
 * - children: contenido dinámico que renderizará cada ruta
 */
export default function Layout({ children }) {
  // Estado que controla si el modal de reserva está abierto o cerrado
  const [reservaOpen, setReservaOpen] = useState(false);

  return (
    <div className="font-sans text-[#1c1c1c] bg-white relative">
      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Navbar con la prop `onOpenReserva` para abrir el modal */}
      <Navbar onOpenReserva={() => setReservaOpen(true)} />
      {/* ──────────────────────────────────────────────────────────────────── */}

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Espaciador para compensar la altura del Navbar fijo (h-24 = 96px) */}
      <div className="h-24" />
      {/* ──────────────────────────────────────────────────────────────────── */}

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Aquí va el contenido específico de cada página (Home, Catalogo, etc.) */}
      {children}
      {/* ──────────────────────────────────────────────────────────────────── */}

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* Footer, botón de WhatsApp flotante y modal de reserva global */}
      <Footer />
      <WhatsAppButton />
      <ReservaModal
        open={reservaOpen}
        onClose={() => setReservaOpen(false)}
        /* No pasamos `habitacion` porque este modal se abre desde Navbar
           (sin preselección). Cuando abramos desde el catálogo, será la
           página CatalogoPage quien invoque a ReservaModal y le pase el objeto
           completo de `habitacion`. */
      />
      {/* ──────────────────────────────────────────────────────────────────── */}
    </div>
  );
}