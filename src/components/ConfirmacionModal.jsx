import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

export default function ConfirmacionModal({ reserva, onClose }) {
  const { t, i18n } = useTranslation();
  const { habitacion, rangoFechas, adultos, ninos, total } = reserva || {};

  const locale = i18n.language === 'es' ? es : enUS;
  const fechaInicio = rangoFechas?.from ? format(rangoFechas.from, 'PPP', { locale }) : '';
  const fechaFin = rangoFechas?.to ? format(rangoFechas.to, 'PPP', { locale }) : '';
  const totalPersonas = (adultos || 0) + (ninos || 0);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 overflow-y-auto">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-[#1f3142] hover:text-red-500"
          aria-label={t('confirmacion.cerrar')}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-[#1f3142] mb-2">{t('confirmacion.titulo')}</h2>
        <p className="text-sm text-gray-700 mb-4">{t('confirmacion.detalle')}</p>

        <div className="text-left text-sm text-[#1f3142] space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold">{t('confirmacion.habitacion')}:</span>
            <span>{habitacion?.nombre}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">{t('confirmacion.fechas')}:</span>
            <span>{fechaInicio} – {fechaFin}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">{t('confirmacion.personas')}:</span>
            <span>{totalPersonas}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">{t('confirmacion.total')}:</span>
            <span>${total?.toLocaleString('es-MX')}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full text-sm px-4 py-2 bg-[#1f3142] text-white rounded-lg hover:bg-[#2a3e55] transition-colors"
        >
          {t('confirmacion.cerrar')}
        </button>
      </div>
    </div>
  );
}