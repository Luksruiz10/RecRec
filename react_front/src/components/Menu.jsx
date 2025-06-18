import { FaHome } from "react-icons/fa";
import { ImBook } from "react-icons/im";
import { ImAddressBook } from "react-icons/im";
import { FaCarrot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { IoFastFoodOutline } from "react-icons/io5";

export let MenuInferior = () => {
    return (
        <div className="flex flex-row justify-between min-w-[375px]">
            <div className="flex flex-col">
                <FaHome />
                <a href="/">Home</a>
            </div>
            <div className="flex flex-col">
                <ImBook />
                <a href="/">Home</a>
            </div>
            <div className="flex flex-col">
                <ImAddressBook />
                <a href="/">Home</a>
            </div>
            <div className="flex flex-col">
                <FaCarrot />
                <a href="/">Home</a>
            </div>
        </div>
    );
}

export let MenuSuperior = () => {
    return (
        <div className="flex flex-row justify-between min-w-[375px]">
            <div className="flex flex-col">
                <IoFastFoodOutline />
                <a href="/">Home</a>
            </div>
            <div className="flex flex-col">
                <FaSearch />
                <a href="/">Home</a>
            </div>
        </div>
    );
}
