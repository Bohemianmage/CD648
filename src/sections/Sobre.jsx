import { useTranslation } from 'react-i18next';

/**
 * About.jsx
 *
 * Sección "Sobre CD648" con:
 * - Título alineado con el resto del sitio (sin desplazamiento manual).
 * - Descripción justificada en columna derecha.
 */
export default function About() {
  const { t } = useTranslation();

  return (
    <section
      id="sobre"
      className="py-20 bg-white text-[#1c1c1c] overflow-x-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between gap-10">
        {/* Título alineado sin desplazamiento */}
        <h2 className="text-[46px] font-bold uppercase text-left leading-tight w-full md:w-2/5">
          {t('about.title')}
        </h2>

        {/* Texto descriptivo alineado y justificado */}
        <p className="text-lg md:text-xl w-full md:w-3/5 text-justify md:text-left">
          {t('about.description')}
        </p>
      </div>
    </section>
  );
}