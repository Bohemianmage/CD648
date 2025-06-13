import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // 👈 Para traducción dinámica
import Layout from '../components/Layout';
import { CatalogSection } from '../sections/Catalog';
import { ReservaModal } from '../components/ReservaModal';
import { obtenerHabitaciones } from '../utils/data'; // 👈 Importar función dinámica
import useRevealOnScroll from '../hooks/useRevealOnScroll';

/**
 * Página Catalog
 *
 * Muestra las habitaciones disponibles con opción a reservar.
 * Las habitaciones se traducen en tiempo real según el idioma global.
 */
export default function Catalog() {
  const { t } = useTranslation(); // Hook de i18n
  const habitaciones = obtenerHabitaciones(t); // 🧠 Traducción en tiempo real

  const [reservaOpen, setReservaOpen] = useState(false);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);

  useRevealOnScroll();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenReserva = (habitacion) => {
    setHabitacionSeleccionada(habitacion);
    setReservaOpen(true);
  };

  return (
    <Layout>
      {/* Contenedor con animación de entrada */}
      <div className="reveal">
        <CatalogSection
          habitaciones={habitaciones} // 👈 Pasamos las habitaciones traducidas
          onReserveRoom={handleOpenReserva}
        />
      </div>

      <ReservaModal
        open={reservaOpen}
        onClose={() => setReservaOpen(false)}
        habitacion={habitacionSeleccionada}
      />
    </Layout>
  );
}