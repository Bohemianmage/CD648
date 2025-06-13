>export default function RoomCard({ titulo, descripcion, imagen, onReservar }) {
  return (
    <div className="flex flex-col items-start gap-4 max-w-sm mx-auto">
      {/* Imagen de la habitación */}
      <img
        src={imagen}
        alt={titulo}
        className="w-full h-64 object-cover rounded-none shadow"
      />

      {/* Título + descripción */}
      <div className="flex flex-col gap-2 px-1">
        <h3 className="text-lg font-semibold tracking-wide">{titulo}</h3>
        <p className="text-sm leading-relaxed text-neutral-600">
          {descripcion}
        </p>
      </div>

      {/* Botón de reserva */}
      <button
        onClick={onReservar}
        className="self-end border border-black px-4 py-1 rounded-full text-sm font-medium hover:bg-black hover:text-white transition"
      >
        Book now
      </button>
    </div>
  );
}