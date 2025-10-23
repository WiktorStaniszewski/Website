import 'styles/Header.css';
import { NavLink, Link } from 'react-router-dom';
import {
  FiShoppingCart,
  FiUser,
  FiHome,
  FiSmartphone,
} from "react-icons/fi";
import { RiDrinks2Fill } from "react-icons/ri";
import { GoPersonFill } from "react-icons/go";
import { AiFillShopping } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";
import LoginControl from './Login/LoginControl';
import useHeaderLogic from 'src/components/hooks/Header/useHeaderLogic.jsx';

function Header() {
  const {
    isShown,
    showOnClick,
    ref,
    isActive,
    toggleClass,
    showLogo,
  } = useHeaderLogic();

  return (
    <>
      <div className="bg-(--header-footer-bg) lg:py-0 flex items-center flex-col transition-all duration-500 ease-in right-0 left-0 sticky top-0 lg:static z-20">
        <div className='flex items-center justify-between w-screen lg:my-10 px-2 lg:px-20 h-22 lg:h-5 z-20'>
          <div>
            <div
              className={isActive ? 'hamburgerIcon' : 'hamburgerIcon navActive'}
              onClick={toggleClass}
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
            <ul className="hidden lg:flex lg:flex-row lg:items-center lg:gap-1">
              <a href="https://www.instagram.com/body.espressobar/" target='_blank'><li className='headerButton'><FaInstagram /></li></a>
              <a href="https://maps.app.goo.gl/4Vyaqvm646KZoFBb6" target='_blank'>
                <li className='headerButton'><SiGooglemaps /></li>
              </a>
            </ul>
          </div>
          <Link to="/"><img className='object-cover object-[30% 50%] block pt-0 w-40 lg:w-60 cursor-pointer' src="/images/logo body_biale.png" alt="logo" /></Link>
          <div className='loginCartDiv'>
            <div ref={ref}>
              <div className='loginButton headerButton' onClick={showOnClick}>
                <FiUser />
              </div>
              {isShown && <LoginControl />}
            </div>
            <div className='cartButton headerButton'>
              <FiShoppingCart />
            </div>
          </div>
        </div>
        <div className={isActive ? 'sidebar' : 'sidebar navActive'}>
          <ul>
            <NavLink to="/" className="sidebarLink"><li><FiHome /> &nbsp;Home</li></NavLink>
            <NavLink to="shop" className="sidebarLink"><li><AiFillShopping /> &nbsp;Sklep</li></NavLink>
            <NavLink to="menu" className="sidebarLink"><li><RiDrinks2Fill /> &nbsp;Menu</li></NavLink>
            <NavLink to="contact" className="sidebarLink"><li><FiSmartphone /> &nbsp;Kontakt</li></NavLink>
            <NavLink to="about" className="sidebarLink"><li><GoPersonFill /> &nbsp;O nas</li></NavLink>
          </ul>
        </div>
      </div>
      <div className="redirectButtons hidden lg:flex lg:flex-row lg:justify-evenly bg-(--header-footer-bg) sticky top-0 z-9 w-screen">
        <ul>
          <div className={`flex justify-center items-center transition-all duration-500 animate-[enlarge_1s_ease-in-out_infinite] ${showLogo ? "logo-visible" : "logo-hidden"}`}>
            <Link to="/"><img className='transition-all duration-500 ease-in-out navigation-logo' src="/images/logo body_biale.png" alt="logo" /></Link>
          </div>
          <NavLink to="/" className="navbarLink"><li>Home</li></NavLink>
          <NavLink to="shop" className="navbarLink"><li>Sklep</li></NavLink>
          <NavLink to="menu" className="navbarLink"><li>Menu</li></NavLink>
          <NavLink to="contact" className="navbarLink"><li>Kontakt</li></NavLink>
          <NavLink to="about" className="navbarLink"><li>O nas</li></NavLink>
          {//<NavLink to="blog" className="navbarLink"><li>Blog</li></NavLink>
          }
        </ul>
      </div>
    </>
  );
}

export default Header;
