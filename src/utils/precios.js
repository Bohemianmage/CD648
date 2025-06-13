export const preciosMock = {
  1: 1200, // Habitación Ejecutiva
  2: 1600, // Suite con Terraza
  3: 900,  // Estancia Compacta
};

export function calcularTotal(precioBase, adultos, ninos, noches = 1) {
  const costoAdultos = adultos * precioBase;
  const costoNinos = ninos * (precioBase * 0.5);
  return (costoAdultos + costoNinos) * noches;
}