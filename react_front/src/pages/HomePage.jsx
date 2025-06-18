import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/NavBar";
import HomeItemCard from "../components/HomeItemCard";

function HomePage() {
  const [recetas, setRecetas] = useState([]);
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState(() => {
    const saved = localStorage.getItem("ingredientesDisponibles");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    axios
      .post("http://localhost:5000/recetas_por_ingredientes", {
        ingredientes: ingredientesDisponibles,
      })
      .then((res) => {
        setRecetas(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener recetas:", err);
      });
  }, [ingredientesDisponibles]);

  const recetasDisponibles = recetas.filter(
    (receta) => receta.estado === "disponible"
  );

  return (
    <div className="min-w-[375px] flex flex-col bg-[#F4F1DE] min-h-screen bg-fixed bg-cover">
      <Navbar />
      <div className="w-full max-w-[1200px] flex flex-col items-center mt-20 mx-auto ">
        <h1 className="text-2xl font-bold my-2 font-['Roboto'] text-left w-full pl-5 min-[430px]:pl-10 min-[480px]:pl-15 min-[820px]:text-3xl">Recetas Recomendadas</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {recetasDisponibles.length > 0 ? (
            recetasDisponibles.map((receta) => (
              <HomeItemCard
                key={receta.id_receta}
                id_receta={receta.id_receta}
                nombre={receta.nombre}
                link_imagen={receta.link_imagen}
              />
            ))
          ) : (
            <p className="text-gray-500">
              {recetas.length > 0
                ? "No hay recetas disponibles con tus ingredientes"
                : "Cargando recetas..."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
