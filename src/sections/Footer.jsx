import { useTranslation } from 'react-i18next';
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import { motion } from 'framer-motion';

/**
 * Footer.jsx
 *
 * Pie de página del sitio CD648.
 * Contiene:
 * - Información de contacto
 * - Créditos
 * - Redes sociales
 *
 * Estilo:
 * - Fondo negro (#1c1c1c)
 * - Texto blanco
 * - Traducción automática con i18next
 * - Entrada animada tipo fade-in con framer-motion
 * - Responsive para pantallas pequeñas
 */

export function Footer() {
  const { t } = useTranslation();

  return (
    <motion.footer
      className="bg-[#1c1c1c] text-white py-10 px-4 sm:px-6 md:px-20"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">

        {/* Información de contacto */}
<div>
  <p className="text-sm sm:text-base">{t('footer.location')}</p>
  <a
    href={`mailto:${t('footer.email')}`}
    className="text-sm sm:text-base hover:text-blue-400 transition"
  >
    {t('footer.email')}
  </a>
</div>

        {/* Redes sociales */}
        <div className="flex gap-4 text-xl">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram className="hover:text-gray-400 transition" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebook className="hover:text-gray-400 transition" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter className="hover:text-gray-400 transition" />
          </a>
        </div>

        {/* Créditos */}
        <div className="text-sm sm:text-base">
          &copy; {new Date().getFullYear()} CD648. {t('footer.rights')}
        </div>
      </div>
    </motion.footer>
  );
}