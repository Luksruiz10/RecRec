import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

let PaginaReceta = () => {
  const { id } = useParams();
  const [receta, setReceta] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/recetas/${id}`)
      .then((res) => {
        setReceta(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener receta:", err);
        setError("No se pudo cargar la receta");
      });
  }, [id]);

  if (error) {
    return (
      <div className="min-w-[375px] flex flex-col items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!receta) {
    return (
      <div className="min-w-[375px] flex flex-col items-center">
        <p className="text-gray-500">Cargando receta...</p>
      </div>
    );
  }

  return (
    <div className="min-w-[375px] flex flex-col bg-[#F4F1DE] min-h-screen lg:h-auto bg-fixed bg-cover">
      <NavBar />
      <div className="w-full max-w-[1200px] mx-auto flex flex-col px-2 md:gap-6 gap-2">
        <div className="flex justify-end">
          <button
            className="text-5xl cursor-pointer"
          >
            ...
          </button>
        </div>
        <img
          src={receta.link_imagen || "/images/placeholder.jpg"}
          alt={receta.nombre}
          className="w-full m-auto h-[150px] md:h-[400px] object-cover rounded-lg mt-5"
        />
        <h1 className="text-2xl lg:text-5xl md:text-3xl font-bold my-2 text-left text-[#E07A5F]">
          {receta.nombre}
        </h1>
        <div className="border border-solid border-gray-300 pl-5 py-2 lg:py-10 shadow-lg">
          <h2 className="text-xl font-bold text-left lg:text-3xl md:text-2xl text-[#E07A5F] mb-2 lg:mb-5">Ingredientes</h2>
          <ul className="list-disc list-inside lg:text-xl">
            {receta.ingredientes.map((ingrediente, index) => (
              <li key={index}>{ingrediente}</li>
            ))}
          </ul>
        </div>
        <h2 className="text-xl font-bold text-left md:text-2xl text-[#E07A5F]">Pasos</h2>
        <ul className="list-inside lg:text-xl list-decimal ">
            {receta.pasos.split("|").map((pasos, index) => (
              <li className="mb-4" key={index}>{pasos}</li>
            ))}
        </ul>
        <p className="text-lg md:text-xl pb-20">
          <span className="font-semibold text-[#E07A5F] md:text-2xl">Tiempo de preparación:</span>{" "}
          {receta.tiempo_preparacion} minutos
        </p>
      </div>
    </div>
  );
};

export default PaginaReceta;
