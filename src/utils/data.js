export function obtenerHabitaciones(t) {
  return [
    {
      id: 1,
      imagen: '/img/junior1.jpg',
      imagenes: [
        '/img/junior1.jpg',
        '/img/junior2.jpg'
      ],
      nombre: t('catalog.rooms.1.name'),
      descripcion: t('catalog.rooms.1.description'),
      amenidades: [
        'full_bathroom',
        'king_size_bed',
        'spacious_closet',
        'equipped_kitchenette',
        'breakfast_bar'
      ]
    },
    {
      id: 2,
      imagen: '/img/master1.jpg',
      imagenes: [
        '/img/master1.jpg',
        '/img/master2.jpg',
        '/img/master3.jpg'
      ],
      nombre: t('catalog.rooms.2.name'),
      descripcion: t('catalog.rooms.2.description'),
      amenidades: [
        'private_terrace',
        'living_room',
        'full_bathroom',
        'king_size_bed',
        'panoramic_view'
      ]
    },
    {
      id: 3,
      imagen: '/img/balcony1.jpg',
      imagenes: [
        '/img/balcony1.jpg',
        '/img/balcony2.jpg'
      ],
      nombre: t('catalog.rooms.3.name'),
      descripcion: t('catalog.rooms.3.description'),
      amenidades: [
        'double_bed',
        'equipped_kitchenette',
        'wifi',
        'spacious_closet',
        'work_desk'
      ]
    }
  ];
}