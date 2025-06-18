// HomeItemCard.jsx
import { Link } from "react-router-dom";

const HomeItemCard = ({ id_receta, nombre, link_imagen, estado }) => {
  const estiloEstado = {
    disponible: "bg-green-100 border-2 border-green-500",
    casi_disponible: "bg-yellow-100 border-2 border-yellow-500",
    no_disponible: "bg-gray-200 border-2 border-gray-500",
  };

  return (
    <Link to={`/receta/${id_receta}`}>
      <div
        className={`
          relative            /* para posicionar el overlay */
          flex flex-col items-center justify-center
          w-[350px] h-[150px]
          shadow-md hover:bg-gray-300 my-2 mx-2 rounded-lg
          overflow-hidden      /* para que el gradiente no se “salga” */
          ${estiloEstado[estado]}
        `}
      >
        <img
          src={link_imagen || "/images/placeholder.jpg"}
          alt={nombre}
          className="w-full h-full object-cover"
        />
        {/* Overlay de gradiente */}
        <div
          className="
            absolute inset-0       /* ocupa todo el contenedor */
            bg-gradient-to-t      /* gradiente de abajo hacia arriba */
            from-gray-800            /* desde negro */
            to-transparent        /* hasta transparente */
          "
        />
        <h2 className="absolute bottom-2 text-lg font-semibold text-white text-center px-2">
          {nombre}
        </h2>
      </div>
    </Link>
  );
};

export default HomeItemCard;
