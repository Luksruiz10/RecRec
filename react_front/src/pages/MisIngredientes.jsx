import { useEffect, useState } from "react";
import axios from "axios";
import ItemIngrediente from "../components/ItemIngrediente";
import NavBar from "../components/NavBar";

function MisIngredientes() {
  const [ingredientes, setIngredientes] = useState([]);
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState(() => {
    const saved = localStorage.getItem("ingredientesDisponibles");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/ingredientes")
      .then((res) => {
        setIngredientes(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener ingredientes:", err);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "ingredientesDisponibles",
      JSON.stringify(ingredientesDisponibles)
    );
  }, [ingredientesDisponibles]);

  const toggleIngrediente = (nombre) => {
    setIngredientesDisponibles((prev) =>
      prev.includes(nombre)
        ? prev.filter((ing) => ing !== nombre)
        : [...prev, nombre]
    );
  };

  return (
    <div className="min-w-[375px] flex flex-col bg-[#F4F1DE] h-full">
      <NavBar />
      <div className="w-full max-w-[1200px] flex flex-col items-center mx-auto mt-20">
        <h1 className="text-2xl font-bold  my-2 font-['Roboto'] text-left w-full pl-8 min-[430px]:pl-12 min-[480px]:pl-19 min-[820px]:text-center min-[820px]:pl-0 min-[820px]:text-3xl mb-5">Mis Ingredientes</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {ingredientes.length > 0 ? (
            ingredientes.map((ingrediente) => (
              <ItemIngrediente
                key={ingrediente.id_ingrediente}
                nombre={ingrediente.nombre}
                link_imagen={ingrediente.link_imagen}
                disponible={ingredientesDisponibles.includes(ingrediente.nombre)}
                onToggle={() => toggleIngrediente(ingrediente.nombre)}
              />
            ))
          ) : (
            <p className="text-gray-500">Cargando ingredientes...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MisIngredientes;