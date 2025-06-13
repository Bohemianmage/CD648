import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import i18n from './i18n/index';
import { I18nextProvider } from 'react-i18next';

// Importamos el contexto global de reserva
import { ReservaProvider } from './context/ReservaContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Proveedor de internacionalización */}
    <I18nextProvider i18n={i18n}>
      
      {/* Proveedor de reserva envuelve toda la app */}
      <ReservaProvider>
        <App />
      </ReservaProvider>

    </I18nextProvider>
  </React.StrictMode>
);