import HomePage from './pages/HomePage';
import Recetas from './pages/Recetas';
import PaginaReceta from './pages/PaginaReceta';
import MisIngredientes from './pages/MisIngredientes';
import FoodScanner from './pages/FoodScanner';
import { Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/recetas" element={<Recetas />} />
      <Route path="/receta/:id" element={<PaginaReceta />} />
      <Route path="/misingredientes" element={<MisIngredientes />} />
      <Route path="/scanner" element={<FoodScanner />} />
    </Routes>
  );
}

export default App;
