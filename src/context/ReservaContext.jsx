import { createContext, useContext, useState } from 'react';

const ReservaContext = createContext();

export function ReservaProvider({ children }) {
  const [reserva, setReserva] = useState(null);
  return (
    <ReservaContext.Provider value={{ reserva, setReserva }}>
      {children}
    </ReservaContext.Provider>
  );
}

export const useReserva = () => useContext(ReservaContext);