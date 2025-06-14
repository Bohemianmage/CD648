import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ReservaCalendar from './ReservaCalendar';
import { obtenerHabitaciones } from '../utils/data';
import { preciosMock, calcularTotal } from '../utils/precios';
import { useReserva } from '../context/ReservaContext';
import { parseISO, eachDayOfInterval, addDays } from 'date-fns';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeEmbeddedForm from './StripeEmbeddedForm';

import { ChevronLeft, ChevronRight } from 'lucide-react';

const stripePromise = loadStripe('pk_test_51RYCZiCyooQFv5CYoJPGLMgU08zDZrjir8tIPhKycK4d6UxrFzWkPcmrFmUM2afDCuimbNMYaKtCSNoNNqqwOSTX00jffGmOUy');

export function ReservaModal({ open, onClose, habitacion }) {
  const { setReserva } = useReserva();
  const { t } = useTranslation();
  const habitaciones = obtenerHabitaciones(t);

  const [selectedRange, setSelectedRange] = useState(undefined);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState('');
  const [adultos, setAdultos] = useState(1);
  const [ninos, setNinos] = useState(0);

  const refImagen = useRef(null);
  const refCalendario = useRef(null);
  const refPago = useRef(null);

  const [reservasOcupadas, setReservasOcupadas] = useState([]);
  const [fechasOcupadas, setFechasOcupadas] = useState([]);

  const precioBase = preciosMock[habitacionSeleccionada] || 0;
  const noches = selectedRange?.from && selectedRange?.to
    ? Math.max(1, Math.round((selectedRange.to - selectedRange.from) / (1000 * 60 * 60 * 24)))
    : 1;
  const total = calcularTotal(precioBase, adultos, ninos, noches);

  useEffect(() => {
    if (open) {
      setHabitacionSeleccionada(habitacion?.id ? String(habitacion.id) : '');
      setSelectedRange(undefined);
      setAdultos(1);
      setNinos(0);
    }
  }, [open, habitacion]);

  useEffect(() => {
    setSelectedRange(undefined);
    if (habitacionSeleccionada && refImagen.current) {
      refImagen.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [habitacionSeleccionada]);

  useEffect(() => {
    if (selectedRange?.from && selectedRange?.to && refCalendario.current) {
      refCalendario.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedRange]);

  const habitacionFinal = habitaciones.find(
    (h) => String(h.id) === habitacionSeleccionada
  );

  const reservaValida =
    habitacionFinal &&
    selectedRange?.from &&
    selectedRange?.to &&
    adultos >= 1;

  useEffect(() => {
    const fetchReservas = async () => {
      if (!habitacionSeleccionada) return;
      const inicio = new Date('2025-06-01').toISOString();
      const fin = new Date('2025-07-15').toISOString();
      try {
console.log('Habitación seleccionada:', habitacionSeleccionada);
        const response = await fetch(
          `https://cd648-backend-production.up.railway.app/api/disponibilidad/${habitacionSeleccionada}?inicio=${inicio}&fin=${fin}`
        );
        if (response.ok) {
          const data = await response.json();
console.log('📦 Respuesta del backend:', data);
          const limpias = data.filter(r => r.from && r.to);
          setReservasOcupadas(limpias);

          const fechas = limpias.flatMap((r) => {
            try {
              const start = parseISO(r.from);
              const end = parseISO(r.to);
              return eachDayOfInterval({ start, end });
            } catch {
              return [];
            }
          });
          setFechasOcupadas(fechas);
        }
      } catch (err) {
        console.error('Error al obtener reservas ocupadas', err);
      }
    };

    fetchReservas();
  }, [habitacionSeleccionada]);

  const fechasRango = selectedRange?.from && selectedRange?.to
    ? eachDayOfInterval({ start: selectedRange.from, end: selectedRange.to })
    : [];

  const hayConflicto = fechasRango.some((fecha) =>
    fechasOcupadas.some((ocupada) => ocupada.getTime() === fecha.getTime())
  );

  useEffect(() => {
    if (reservaValida && !hayConflicto && refPago.current) {
      refPago.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [reservaValida, hayConflicto]);

  const handlePagoExitoso = async () => {
    try {
      const res = await fetch('https://cd648-backend-production.up.railway.app/api/reservas', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': import.meta.env.VITE_ADMIN_KEY,
        },
        body: JSON.stringify({
          habitacion: habitacionSeleccionada,
          inicio: selectedRange?.from,
          fin: selectedRange?.to,
          adultos,
          ninos
        })
      });

      if (!res.ok) throw new Error('Error al guardar la reserva.');

      setReserva({ habitacion: habitacionFinal, rangoFechas: selectedRange, adultos, ninos });
      alert(t('reserva.exito'));
      onClose();
    } catch (err) {
      console.error(err);
      alert(t('reserva.errorServidor'));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 overflow-y-auto">
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-3xl sm:max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl sm:text-2xl text-[#1f3142] hover:text-red-500"
          aria-label={t('reserva.titulo')}
        >
          &times;
        </button>

        <div className="flex flex-col lg:flex-row items-stretch gap-6 mb-6">
          <div className="flex-1 flex items-center justify-center max-w-full">
            <div className="rounded-lg p-3 sm:p-4 flex flex-col gap-3 min-h-[280px] justify-center w-full">
              <select
                id="habitacion"
                value={habitacionSeleccionada}
                onChange={(e) => setHabitacionSeleccionada(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#1f3142]"
              >
                <option value="">{t('reserva.eligeHabitacion')}</option>
                {habitaciones.map((h) => (
                  <option key={h.id} value={String(h.id)}>{h.nombre}</option>
                ))}
              </select>

              <div className="flex justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#1f3142]">{t('reserva.adultos')}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setAdultos((prev) => Math.max(1, prev - 1))}
                      disabled={adultos <= 1}
                      className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 text-[#1f3142] hover:bg-gray-200 disabled:opacity-40"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="w-6 text-center font-medium">{adultos}</span>
                    <button
                      onClick={() => setAdultos((prev) => Math.min(2, prev + 1))}
                      disabled={adultos >= 2}
                      className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 text-[#1f3142] hover:bg-gray-200 disabled:opacity-40"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#1f3142]">{t('reserva.ninos')}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setNinos((prev) => Math.max(0, prev - 1))}
                      disabled={ninos <= 0}
                      className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 text-[#1f3142] hover:bg-gray-200 disabled:opacity-40"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="w-6 text-center font-medium">{ninos}</span>
                    <button
                      onClick={() => setNinos((prev) => Math.min(1, prev + 1))}
                      disabled={ninos >= 1}
                      className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 text-[#1f3142] hover:bg-gray-200 disabled:opacity-40"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {habitacionFinal && (
                <div ref={refImagen} className="overflow-hidden rounded-xl shadow">
                  <img src={habitacionFinal.imagen} alt={habitacionFinal.nombre} className="w-full h-32 sm:h-40 object-cover" />
                  <div className="p-2 sm:p-3">
                    <h3 className="text-lg font-semibold text-[#1f3142]">{habitacionFinal.nombre}</h3>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div ref={refCalendario} className="flex-1 flex items-center justify-center">
            {!habitacionSeleccionada ? (
              <div className="relative w-full h-[320px] sm:h-[360px]">
                <p className="absolute inset-0 flex items-center justify-center text-sm text-gray-600 italic text-center">
                  {t('reserva.disponibilidad')}
                </p>
              </div>
            ) : (
              <div className="w-fit h-fit flex items-center justify-center">
                <ReservaCalendar
                  selected={selectedRange}
                  onSelect={setSelectedRange}
                  fechasOcupadas={fechasOcupadas}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-4" ref={refPago}>
          {habitacionFinal && selectedRange?.from && selectedRange?.to && !hayConflicto && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-md px-4 py-3 text-sm">
              <div className="flex justify-between items-center text-[#1f3142] gap-4 text-sm">
                <div className="flex-1 text-center">
                  <p className="font-semibold">{t('reserva.personas')}</p>
                  <p className="font-medium">{adultos + ninos}</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="font-semibold">{t('reserva.noches')}</p>
                  <p className="font-medium">{noches}</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="font-semibold">{t('reserva.total')}</p>
                  <p className="text-base sm:text-lg font-bold">${total.toLocaleString('es-MX')}</p>
                </div>
              </div>
            </div>
          )}

          {hayConflicto ? (
            <p className="text-red-600 text-sm text-center font-medium mt-2">
              {t('reserva.errorConflicto')}
            </p>
          ) : reservaValida && (
            <Elements stripe={stripePromise}>
              <StripeEmbeddedForm
                className="mt-4 w-full text-sm sm:text-base px-4 py-3 bg-[#1f3142] text-white rounded-xl hover:bg-[#2a3e55] transition-colors duration-200 border border-gray-300"
                monto={total}
                descripcion={`Reserva para ${adultos + ninos} personas en ${habitacionFinal?.nombre}`}
                onSuccess={handlePagoExitoso}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}