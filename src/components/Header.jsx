import 'styles/Header.css';
import { NavLink, Link } from 'react-router-dom';
import {
  FiShoppingCart,
  FiHome,
  FiSmartphone,
  FiLogIn,   
  FiUserCheck
} from "react-icons/fi";
import { RiDrinks2Fill } from "react-icons/ri";
import { GoPersonFill } from "react-icons/go";
import { AiFillShopping } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";

import { useCart } from 'components/Context/Cart/CartProvider';
import LoginWidget from 'components/Login/LoginWidget'; 
import { useAuth } from 'components/Context/Login/AuthProvider';
import useHeaderLogic from 'hooks/Header/useHeaderLogic';

export default function Header() {
  const { user } = useAuth(); 
  const { cartCount } = useCart();

  const {
    isActive,
    toggleClass,
    showLogo,
  } = useHeaderLogic();


  return (
    <>
      <div className="lg:bg-(--header-footer-bg) lg:py-0 flex items-center flex-col transition-all duration-500 ease-in sticky top-0 lg:static z-20 lg:pt-2 mb-1 lg:mb-0">
        
        {/* Main Header Bar */}
        <div className={`${isActive ? 'bg-(--header-footer-bg)' : ''} flex items-center justify-between w-9/10 lg:my-10 px-2 lg:px-20 h-22 lg:h-0 z-20 rounded-3xl not-lg:mt-2 transition-colors ease-in-out duration-200`}>
          
          {/* Left Side: Hamburger & Socials */}
          <div className="flex-1 flex justify-start">
            <div
              className={isActive ? 'hamburgerIcon' : 'hamburgerIcon navActive'}
              onClick={toggleClass}
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
            
            <ul className="hidden lg:flex lg:flex-row lg:items-center lg:gap-1 ml-4">
              <a href="https://www.instagram.com/SomniumCafeBar/" target='_blank' rel="noreferrer">
                <li className='headerButton'><FaInstagram /></li>
              </a>
              <a href="https://maps.app.goo.gl/4Vyaqvm646KZoFBb6" target='_blank' rel="noreferrer">
                <li className='headerButton'><SiGooglemaps /></li>
              </a>
            </ul>
          </div>

          {/* 2. Center Side - The Logo */}
          <div className="flex justify-center shrink-0">
            <Link to="/">
              <img className='block pt-0 w-35 lg:w-60 cursor-pointer' src="/images/logo body_biale.png" alt="logo" />
            </Link>
          </div>

          {/* 3. Right Side - force it to match the left width */}
          <div className='flex-1 flex justify-end items-center gap-2'>
            <div className={`
              flex justify-center items-center transition-all duration-300
              ${isActive 
                ? 'opacity-100 scale-100 w-auto' 
                : 'opacity-0 scale-50 w-0 pointer-events-none'
              }
            `}>
              <LoginWidget />
            </div>

            <Link to="/cart">
              <div className='cartButton headerButton relative'>
                <FiShoppingCart />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Sidebar Navigation */}
        <div className={isActive ? 'sidebar' : 'sidebar navActive'}>
          <ul>
            <NavLink to="/" className="sidebarLink" onClick={toggleClass}><li><FiHome /> &nbsp;Home</li></NavLink>
            <NavLink to="shop" className="sidebarLink" onClick={toggleClass}><li><AiFillShopping /> &nbsp;Sklep</li></NavLink>
            <NavLink to="menu" className="sidebarLink" onClick={toggleClass}><li><RiDrinks2Fill /> &nbsp;Menu</li></NavLink>
            <NavLink to="recruitment" className="sidebarLink" onClick={toggleClass}><li><FiSmartphone /> &nbsp;Rekrutacja</li></NavLink>
            <NavLink to="about" className="sidebarLink" onClick={toggleClass}><li><GoPersonFill /> &nbsp;O nas</li></NavLink>
            {user?.role === 'admin' && (
              <NavLink 
                to="/admin" 
                className="navbarLink transition-all"
              >
                <li>Panel Admina</li>
              </NavLink>
            )}
            
            {/* Mobile-only Login/Profile Link */}
            <div className="mt-4 border-t border-white/10 lg:hidden">
              {user ? (
                 <div className="sidebarLink text-green-400 text-center" onClick={toggleClass}>
                    <li><FiUserCheck />Witaj, {user.username}</li>
                 </div>
              ) : (
                 <NavLink to="login" className="sidebarLink" onClick={toggleClass}>
                    <li><FiLogIn /> &nbsp;Zaloguj się</li>
                 </NavLink>
              )}
            </div>
          </ul>
        </div>
      </div>

      {/* Desktop Navigation Bar (Sticky) */}
      <div className="redirectButtons hidden lg:flex lg:flex-row lg:justify-evenly bg-(--header-footer-bg) sticky top-0 z-10 w-screen shadow-md">
        <ul>
          <div className={`flex justify-center items-center transition-all duration-500 animate-[enlarge_1s_ease-in-out_infinite] ${showLogo ? "logo-visible" : "logo-hidden"}`}>
            <Link to="/"><img className='transition-all duration-500 ease-in-out navigation-logo' src="/images/logo body_biale.png" alt="logo" /></Link>
          </div>
          <NavLink to="/" className="navbarLink"><li>Home</li></NavLink>
          <NavLink to="shop" className="navbarLink"><li>Sklep</li></NavLink>
          <NavLink to="menu" className="navbarLink"><li>Menu</li></NavLink>
          <NavLink to="recruitment" className="navbarLink"><li>Rekrutacja</li></NavLink>
          <NavLink to="about" className="navbarLink"><li>O nas</li></NavLink>
          {user?.role === 'admin' && (
            <NavLink 
              to="/admin" 
              className="navbarLink transition-all"
            >
              <li>Panel Admina</li>
            </NavLink>
          )}
        </ul>
      </div>
    </>
  );
}
