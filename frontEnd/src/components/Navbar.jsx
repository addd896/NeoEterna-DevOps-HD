import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import nav from "../assets/nav.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-10  w-full bg-black px-8 py-4 shadow flex items-center justify-between">
        {/* Logo */}
        <div className="flex w-full cursor-pointer items-center justify-between">
      
        <Link to="/" className="flex items-center gap-2 text-purple-500 text-xl font-bold">
           <img className="h-10 w-10 mt-2" src={nav} alt="NeoEterna Logo" />
           <span className="text-purple-500 text-xl font-bold">NEOETERNA</span>
         </Link>
      
         <button onClick={() => setIsMenuOpen(!isMenuOpen)}className="md:hidden text-white focus:outline-none">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
         </button>
         </div>

         {/* Middle: Nav Links */}
         <ul
        className={`md:flex md:items-center md:justify-end md:static absolute w-full left-0 bg-black md:bg-transparent 
        md:w-auto md:py-0 py-4 md:pl-0 pl-7 transition-all duration-500 ease-in 
        ${isMenuOpen ? "top-16 opacity-100" : "top-[-400px] opacity-0"} z-10`}>
            <li className="mx-4 my-6 md:my-0">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-700 dark:text-white hover:text-purple-600 duration-500 transition">Home</Link>
            </li>
            <li className="mx-4 my-6 md:my-0">
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-gray-700 dark:text-white hover:text-purple-600 duration-500 transition">About</Link>
            </li>
            <li className="mx-4 my-6 md:my-0">
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-gray-700 dark:text-white hover:text-purple-600 duration-500 transition">Contact</Link>
            </li>
            <button  onClick={() => {setIsMenuOpen(false); navigate("/login");}} className="bg-purple-600 text-white duration-500 px-6 py-2 mx-4 rounded hover:bg-purple-700">
            Get Started
            </button> 
         </ul>
    </nav>
);
};
export default Navbar;
