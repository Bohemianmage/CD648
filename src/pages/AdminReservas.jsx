// src/pages/AdminReservas.jsx

import { useState, useEffect } from 'react';

/**
 * Página de administración de reservas.
 * Protegida con una clave de acceso básica.
 */
export default function AdminReservas() {
  const [claveIngresada, setClaveIngresada] = useState('');
  const [accesoPermitido, setAccesoPermitido] = useState(false);
  const [reservas, setReservas] = useState([]);
  const CLAVE_CORRECTA = 'admin123'; // puedes cambiarla aquí

  const handleSubmit = (e) => {
    e.preventDefault();
    if (claveIngresada === CLAVE_CORRECTA) {
      setAccesoPermitido(true);
    } else {
      alert('Clave incorrecta.');
    }
  };

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await fetch('https://cd648-backend-production.up.railway.app/api/reservas', {
          headers: {
            'x-admin-key': CLAVE_CORRECTA,
          },
        });
        const data = await res.json();
        setReservas(data);
      } catch (err) {
        console.error('Error al obtener reservas:', err);
      }
    };

    if (accesoPermitido) {
      fetchReservas();
    }
  }, [accesoPermitido]);

  if (!accesoPermitido) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-6 max-w-sm w-full"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">Acceso restringido</h2>
          <input
            type="password"
            placeholder="Ingresa la clave"
            value={claveIngresada}
            onChange={(e) => setClaveIngresada(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          />
          <button
            type="submit"
            className="w-full bg-[#1f3142] text-white py-2 rounded hover:bg-[#2a3e55]"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Reservas registradas</h1>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Habitación</th>
            <th className="border px-4 py-2 text-left">Inicio</th>
            <th className="border px-4 py-2 text-left">Fin</th>
            <th className="border px-4 py-2 text-left">Adultos</th>
            <th className="border px-4 py-2 text-left">Niños</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva._id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{reserva.habitacion}</td>
              <td className="border px-4 py-2">{new Date(reserva.inicio).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{new Date(reserva.fin).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{reserva.adultos}</td>
              <td className="border px-4 py-2">{reserva.ninos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}