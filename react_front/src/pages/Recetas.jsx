import { useEffect, useState } from "react";
import axios from "axios";
import HomeItemCard from "../components/HomeItemCard";
import NavBar from "../components/NavBar";


//La idea aca es que si la receta esta disponible(segun los ingredientes) se muestre primero con el recuadro de algun color, si no esta disponible pero falta uno 1 o 2 ingredientes se muestre de otro color y ya si no esta disponible que se muestre opaco. Hay que agregar la funcion disponible en la base de datos.

function Recetas() {
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

  return (
    <div className="min-w-[375px] flex flex-col bg-[#F4F1DE] h-full">
      <NavBar />
      <div className="w-full max-w-[1200px] flex flex-col items-center mt-20 mx-auto">
        <h1 className="text-2xl font-bold  my-2 font-['Roboto'] text-left w-full pl-5 min-[430px]:pl-10 min-[480px]:pl-15 min-[820px]:text-3xl">Recetas Disponibles</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {recetas.length > 0 ? (
            recetas.map((receta) => (
              <HomeItemCard
                key={receta.id_receta}
                id_receta={receta.id_receta}
                nombre={receta.nombre}
                link_imagen={receta.link_imagen}
                estado={receta.estado}
              />
            ))
          ) : (
            <p className="text-gray-500">Cargando recetas...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recetas;
