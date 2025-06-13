
import { useTranslation } from 'react-i18next';

/**
 * Hero.jsx
 *
 * Imagen de fondo a pantalla completa.
 * Se eliminó el contenido textual central.
 */
export function Hero() {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      className="
        h-screen
        bg-cover
        bg-center
        flex
        items-center
        justify-center
        relative
        isolate
      "
      style={{ backgroundImage: "url('/img/hero-placeholder.jpg')" }}
    >
      {/* Imagen de fondo full screen sin texto ni overlay */}
    </section>
  );
}