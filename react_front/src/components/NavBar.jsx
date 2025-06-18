import { useState } from "react";
import { FaBars, FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const currentPath = location.pathname;

  const navLinkStyle = (path) =>
    `hover:text-gray-500 ${
      currentPath === path ? "border-b-2 border-[#E07A5F]" : ""
    }`;

  return (
    <header className="fixed top-0 left-0 w-full bg-[#81B29A] z-50 shadow">
      <nav className="flex justify-between items-center max-w-[1200px] mx-auto px-4 py-3">
        {/* Logo */}
        <div>
          <img
            className="w-30 h-auto object-contain object-center cursor-pointer"
            src="../Logo.png"
            alt="Logo"
          />
        </div>

        {/* Links */}
        <div
          className={`duration-500 md:static absolute top-full left-0 md:bg-transparent bg-[#81B29A] md:min-h-fit min-h-[30vh] w-full md:w-auto px-5
            flex items-center ${
              menuOpen
                ? "opacity-100 visible"
                : "opacity-0 invisible md:opacity-100 md:visible"
            }
          `}
        >
          <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8 font-['Oswald'] text-xl">
            <li>
              <a className={navLinkStyle("/")} href="/">HOME</a>
            </li>
            <li>
              <a className={navLinkStyle("/recetas")} href="/recetas">RECETAS</a>
            </li>
            <li>
              <a className={navLinkStyle("/misrecetas")} href="/misrecetas">MIS RECETAS</a>
            </li>
            <li>
              <a className={navLinkStyle("/misingredientes")} href="/misingredientes">INGREDIENTES</a>
            </li>
            <li>
              <a className={navLinkStyle("/scanner")} href="/scanner">SCANNER</a>
            </li>
          </ul>
        </div>

        {/* Iconos */}
        <div className="flex items-center gap-4">
          <button className="bg-[#E07A5F] text-white px-3 py-2 rounded-full hover:bg-[#F4F1DE] hover:text-[#E07A5F]">
            <FaSearch />
          </button>
          <button
            onClick={handleToggle}
            className="text-3xl cursor-pointer md:hidden text-gray-800"
          >
            <FaBars />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;