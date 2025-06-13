/**
 * Genera la lista de habitaciones traducidas dinámicamente.
 * Usa el ID como clave para acceder a `catalog.rooms.{id}`.
 * @param {Function} t - Función de traducción de i18next
 * @returns {Array} habitaciones traducidas
 */
export function obtenerHabitaciones(t) {
  return [
    {
      id: 1,
      imagen: '/img/junior1.jpg',
      imagenes: [
        '/img/junior1.jpg',
        '/img/junior2.jpg',
      ],
      nombre: t('catalog.rooms.1.name'),
      descripcion: t('catalog.rooms.1.description'),
      amenidades: t('catalog.rooms.1.amenities', { returnObjects: true }),
    },
    {
      id: 2,
      imagen: '/img/master1.jpg',
      imagenes: [
        '/img/master1.jpg',
        '/img/master2.jpg',
        '/img/master3.jpg',
      ],
      nombre: t('catalog.rooms.2.name'),
      descripcion: t('catalog.rooms.2.description'),
      amenidades: t('catalog.rooms.2.amenities', { returnObjects: true }),
    },
    {
      id: 3,
      imagen: '/img/balcony1.jpg',
      imagenes: [
        '/img/balcony1.jpg',
        '/img/balcony2.jpg',
      ],
      nombre: t('catalog.rooms.3.name'),
      descripcion: t('catalog.rooms.3.description'),
      amenidades: t('catalog.rooms.3.amenities', { returnObjects: true }),
    },
  ];
}

/**
 * Mock de reservas existentes.
 * Sirve para bloquear fechas en el calendario.
 */
export const reservasMock = [
  {
    habitacionId: 1,
    from: '2025-06-10',
    to: '2025-06-15',
  },
  {
    habitacionId: 1,
    from: '2025-06-20',
    to: '2025-06-22',
  },
  {
    habitacionId: 2,
    from: '2025-06-12',
    to: '2025-06-14',
  },
];