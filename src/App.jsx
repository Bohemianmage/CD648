import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Reglamento from './pages/Reglamento';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
	<Route path="/rules" element={<Reglamento />} />
      </Routes>
    </BrowserRouter>
  );
}