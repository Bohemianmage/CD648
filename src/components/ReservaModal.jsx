import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import ReservaCalendar from './ReservaCalendar';
import ConfirmacionModal from './ConfirmacionModal';
import { obtenerHabitaciones } from '../utils/data';
import { preciosMock, calcularTotal } from '../utils/precios';
import { useReserva } from '../context/ReservaContext';
import { parseISO, eachDayOfInterval } from 'date-fns';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeEmbeddedForm from './StripeEmbeddedForm';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const stripePromise = loadStripe('pk_test_51RYCZiCyooQFv5CYoJPGLMgU08zDZrjir8tIPhKycK4d6UxrFzWkPcmrFmUM2afDCuimbNMYaKtCSNoNNqqwOSTX00jffGmOUy');

const matrizHabitaciones = {
  1: [1, 2, 3],
  2: [4, 5, 6],
  3: [7, 8],
};

export function ReservaModal({ open, onClose, habitacion }) {
  const { setReserva } = useReserva();
  const { t } = useTranslation();
  const habitaciones = obtenerHabitaciones(t);

  const [selectedRange, setSelectedRange] = useState(undefined);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState('');
  const [adultos, setAdultos] = useState(1);
  const [ninos, setNinos] = useState(0);
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarFormularioCliente, setMostrarFormularioCliente] = useState(false);
  const [cliente, setCliente] = useState(null);

  const refPago = useRef(null);

  const precioBase = preciosMock[habitacionSeleccionada] || 0;
  const noches = selectedRange?.from && selectedRange?.to
    ? Math.max(1, Math.round((selectedRange.to - selectedRange.from) / (1000 * 60 * 60 * 24)))
    : 1;
  const total = calcularTotal(precioBase, adultos, ninos, noches);

  const fetchFechasOcupadas = async () => {
    if (!habitacionSeleccionada) return;
    try {
      const res = await fetch(`https://cd648-backend-production.up.railway.app/api/disponibilidad/${habitacionSeleccionada}?inicio=2025-01-01&fin=2026-01-01`);
      const data = await res.json();
      if (!Array.isArray(data)) return;
      const habitacionesTipo = matrizHabitaciones[Number(habitacionSeleccionada)] || [];
      const fechasPorHabitacion = {};
      habitacionesTipo.forEach((num) => {
        fechasPorHabitacion[num] = new Set();
      });
      data.forEach(({ from, to, habitacion }) => {
        if (!habitacionesTipo.includes(habitacion)) return;
        const start = parseISO(from);
        const end = parseISO(to);
        const dias = eachDayOfInterval({ start, end });
        dias.forEach((d) => {
          const clave = d.toISOString().split('T')[0];
          fechasPorHabitacion[habitacion].add(clave);
        });
      });
      const conteoFechas = {};
      habitacionesTipo.forEach((habitacion) => {
        fechasPorHabitacion[habitacion].forEach((fecha) => {
          conteoFechas[fecha] = (conteoFechas[fecha] || 0) + 1;
        });
      });
      const fechasBloqueadas = Object.entries(conteoFechas)
        .filter(([_, count]) => count >= habitacionesTipo.length)
        .map(([fecha]) => {
          const d = parseISO(fecha);
          d.setHours(0, 0, 0, 0);
          return d;
        });
      setFechasOcupadas(fechasBloqueadas);
    } catch {}
  };

  useEffect(() => {
    if (open) {
      setHabitacionSeleccionada(habitacion?.id ? String(habitacion.id) : '');
      setSelectedRange(undefined);
      setAdultos(1);
      setNinos(0);
      setCliente(null);
      fetchFechasOcupadas();
    }
  }, [open, habitacion]);

  useEffect(() => {
    fetchFechasOcupadas();
  }, [habitacionSeleccionada]);

  const habitacionFinal = habitaciones.find((h) => String(h.id) === habitacionSeleccionada);
  const fechasRango = selectedRange?.from && selectedRange?.to ? eachDayOfInterval({ start: selectedRange.from, end: selectedRange.to }) : [];
  const hayConflicto = fechasRango.some((fecha) => fechasOcupadas.some((bloqueada) => bloqueada.getTime() === fecha.getTime()));
  const reservaValida = habitacionFinal && selectedRange?.from && selectedRange?.to && adultos >= 1;

  useEffect(() => {
    if (reservaValida && !hayConflicto && refPago.current) {
      refPago.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedRange, reservaValida, hayConflicto]);

 const handlePagoExitoso = async () => {
  try {
    // Validación previa de campos del cliente
    if (!cliente?.nombre || !cliente?.email || !cliente?.telefono) {
      alert('Por favor completa tu nombre, correo y teléfono antes de continuar.');
      console.warn('❗ Información de cliente incompleta:', cliente);
      return;
    }

    // Preparar payload
    const payload = {
      tipoHabitacion: Number(habitacionSeleccionada),
      inicio: selectedRange?.from,
      fin: selectedRange?.to,
      adultos,
      ninos,
      total,
      cliente: {
	  nombre: String(cliente?.nombre || ''),
	  email: String(cliente?.email || ''),
	  telefono: String(cliente?.telefono || ''),
      }
    };

    // Enviar solicitud al backend
    const res = await fetch('https://cd648-backend-production.up.railway.app/api/reservas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': import.meta.env.VITE_ADMIN_KEY,
      },
      body: JSON.stringify(payload),
    });

    // Validar respuesta
    if (!res.ok) throw new Error('Error en la solicitud');

    // Mostrar confirmación
    setReserva({ habitacion: habitacionFinal, rangoFechas: selectedRange, adultos, ninos });
    setMostrarConfirmacion(true);
  } catch (error) {
    console.error('❌ Error al enviar reserva:', error);
    alert(t('reserva.errorServidor'));
  }
};

  if (mostrarConfirmacion) {
    return (
      <ConfirmacionModal
        reserva={{ habitacion: habitacionFinal, rangoFechas: selectedRange, adultos, ninos, total }}
        onClose={() => setMostrarConfirmacion(false)}
      />
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 overflow-y-auto">
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-3xl sm:max-w-4xl relative">
        <button onClick={onClose} className="absolute top-3 right-4 text-xl sm:text-2xl text-[#1f3142] hover:text-red-500">&times;</button>
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
                    <button onClick={() => setAdultos((prev) => Math.max(1, prev - 1))} disabled={adultos <= 1} className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 text-[#1f3142] hover:bg-gray-200 disabled:opacity-40"><ChevronLeft size={16} /></button>
                    <span className="w-6 text-center font-medium">{adultos}</span>
                    <button onClick={() => setAdultos((prev) => Math.min(2, prev + 1))} disabled={adultos >= 2} className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 text-[#1f3142] hover:bg-gray-200 disabled:opacity-40"><ChevronRight size={16} /></button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#1f3142]">{t('reserva.ninos')}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setNinos((prev) => Math.max(0, prev - 1))} disabled={ninos <= 0} className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 text-[#1f3142] hover:bg-gray-200 disabled:opacity-40"><ChevronLeft size={16} /></button>
                    <span className="w-6 text-center font-medium">{ninos}</span>
                    <button onClick={() => setNinos((prev) => Math.min(1, prev + 1))} disabled={ninos >= 1} className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 text-[#1f3142] hover:bg-gray-200 disabled:opacity-40"><ChevronRight size={16} /></button>
                  </div>
                </div>
              </div>

              {habitacionFinal && (
                <div className="overflow-hidden rounded-xl shadow">
                  <img src={habitacionFinal.imagen} alt={habitacionFinal.nombre} className="w-full h-32 sm:h-40 object-cover" />
                  <div className="p-2 sm:p-3">
                    <h3 className="text-lg font-semibold text-[#1f3142]">{habitacionFinal.nombre}</h3>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            {!habitacionSeleccionada ? (
              <div className="relative w-full h-[320px] sm:h-[360px]">
                <p className="absolute inset-0 flex items-center justify-center text-sm text-gray-600 italic text-center">
                  {t('reserva.disponibilidad')}
                </p>
              </div>
            ) : (
              <div className="w-fit h-fit flex items-center justify-center">
                <ReservaCalendar selected={selectedRange} onSelect={setSelectedRange} fechasOcupadas={fechasOcupadas} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-4" ref={refPago}>
          {reservaValida && !hayConflicto && !cliente && (
            <button
              onClick={() => setMostrarFormularioCliente(true)}
              className="w-full text-sm sm:text-base px-4 py-3 bg-[#1f3142] text-white rounded-xl hover:bg-[#2a3e55] transition-colors duration-200 border border-gray-300"
            >
              {t('reserva.proceder')}
            </button>
          )}

          {reservaValida && !hayConflicto && cliente && (
            <Elements stripe={stripePromise}>
              <StripeEmbeddedForm
                monto={total}
                descripcion={`Reserva para ${adultos + ninos} personas en ${habitacionFinal?.nombre}`}
                onSuccess={handlePagoExitoso}
              />
            </Elements>
          )}

          {mostrarFormularioCliente && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-[#1f3142]">{t('reserva.datosCliente')}</h2>
                <Formik
                  initialValues={{ nombre: '', email: '', telefono: '' }}
                  validationSchema={Yup.object({
                    nombre: Yup.string().required('Nombre requerido'),
                    email: Yup.string().email('Correo inválido').required('Correo requerido'),
                    telefono: Yup.string().required('Teléfono requerido'),
                  })}
                  onSubmit={(values) => {
                    setCliente(values);
                    setMostrarFormularioCliente(false);
                  }}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-4">
                      <div>
                        <Field name="nombre" type="text" placeholder={t('form.nombre')} className="w-full border px-3 py-2 rounded-md" />
                        {touched.nombre && errors.nombre && <div className="text-red-500 text-sm">{errors.nombre}</div>}
                      </div>
                      <div>
                        <Field name="email" type="email" placeholder={t('form.email')} className="w-full border px-3 py-2 rounded-md" />
                        {touched.email && errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                      </div>
                      <div>
                        <Field name="telefono" type="text" placeholder={t('form.telefono')} className="w-full border px-3 py-2 rounded-md" />
                        {touched.telefono && errors.telefono && <div className="text-red-500 text-sm">{errors.telefono}</div>}
                      </div>
                      <div className="flex justify-between gap-3 pt-4">
                        <button type="button" onClick={() => setMostrarFormularioCliente(false)} className="px-4 py-2 bg-gray-200 rounded-md text-sm">{t('reserva.cancelar')}</button>
                        <button type="submit" className="px-4 py-2 bg-[#1f3142] text-white rounded-md text-sm hover:bg-[#2a3e55]">{t('reserva.continuar')}</button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
