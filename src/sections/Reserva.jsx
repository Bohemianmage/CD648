export default function Reserva() {
  return (
    <section id="reserva" className="py-16 px-6 md:px-20 bg-[#dedbd5] text-[#1c1c1c]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Reserva tu Estancia</h2>
        <p className="text-lg md:text-xl mb-6">Consulta disponibilidad y asegura tu habitación inteligente en CD648.</p>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="text" placeholder="Nombre completo" />
          </div>
          <div className="mb-4">
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="email" placeholder="Correo electrónico" />
          </div>
          <div className="mb-4">
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="date" placeholder="Fecha de entrada" />
          </div>
          <div className="mb-6">
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="date" placeholder="Fecha de salida" />
          </div>
          <button className="bg-[#1f3142] hover:bg-[#a6bdde] text-white font-bold py-2 px-4 rounded" type="submit">
            Reservar
          </button>
        </form>
      </div>
    </section>
  );
}