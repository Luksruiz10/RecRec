const ItemIngrediente = ({ nombre, link_imagen, disponible, onToggle }) => {
  return (
    <div className={`flex flex-col items-center justify-center w-[150px] h-[150px] shadow-md my-3 rounded-lg ${disponible ? 'bg-green-100' : 'bg-gray-200'} hover:bg-gray-300`}>
      <img
        src={link_imagen || "/images/placeholder.jpg"}
        alt={nombre}
        className="w-full max-h-[100px] min-h-[100px] object-cover rounded-t-lg "
      />
      <h2 className="text-lg font-semibold text-center mt-2">{nombre}</h2>
      <button
        onClick={onToggle}
        className={`mt-2 px-2 py-1 rounded ${disponible ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
      >
        {disponible ? 'Quitar' : 'Añadir'}
      </button>
    </div>
  );
};

export default ItemIngrediente;
