import { useTranslation } from 'react-i18next';
import {
  DoorOpen,
  Shirt,
  Package,
  Key,
  LockKeyhole,
  Wifi,
  Droplet,
  ShowerHead,
} from 'lucide-react';

/**
 * Concierge.jsx
 *
 * Sección de servicios con layout cuadrante y título alineado visualmente con el resto del sitio.
 */
export function Concierge() {
  const { t } = useTranslation();

  const servicios = [
    { icono: <DoorOpen className="w-6 h-6" />, texto: t('concierge.cleaning') },
    { icono: <Shirt className="w-6 h-6" />, texto: t('concierge.laundry') },
    { icono: <Package className="w-6 h-6" />, texto: t('concierge.packages') },
    { icono: <Key className="w-6 h-6" />, texto: t('concierge.locker') },
    { icono: <LockKeyhole className="w-6 h-6" />, texto: t('concierge.safe') },
    { icono: <Wifi className="w-6 h-6" />, texto: t('concierge.wifi') },
    { icono: <Droplet className="w-6 h-6" />, texto: t('concierge.shower') },
    { icono: <ShowerHead className="w-6 h-6" />, texto: t('concierge.toiletries') },
  ];

  return (
    <section
      id="concierge"
      className="py-12 md:py-20 bg-white text-[#1c1c1c]"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-12">
          {/* Columna izquierda: Título */}
          <div className="flex items-start md:items-center justify-start">
            <h2 className="text-[46px] font-bold uppercase text-left">
              {t('concierge.title')}
            </h2>
          </div>

          {/* Columna derecha: Amenidades */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-base">
            {servicios.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 text-left"
              >
                <div>{s.icono}</div>
                <span className="text-[15px]">{s.texto}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}