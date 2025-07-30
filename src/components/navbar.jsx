import '../styles/navbar.css'
import { useState } from "react";
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { RiDrinks2Fill } from "react-icons/ri";
import { FiSmartphone } from "react-icons/fi";
import { GoPersonFill } from "react-icons/go";
import { AiFillShopping } from "react-icons/ai";
import {Link as Reference, Element} from 'react-scroll';

function Navbar() {

    //toggling the active class for sidebar and hamburger icon
    const [isActive, setIsActive] = useState(true);
    const toggleClass = () => {
        setIsActive(prev => !prev)
    }

  return (
    <div className="headContainer">
        <div className='topHeader'>
            <div className="leftSide">
                <div className={isActive ? 'hamburgerIcon' : 'hamburgerIcon navActive'}  onClick={toggleClass}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            </div>
            <Link to="/"><img src="/images/logo body_biale.png" alt="logo"></img></Link>
            <div className='loginCartDiv'>
                <div className='login headerButton'><FiUser /></div>
                <div className='cart headerButton'><FiShoppingCart /></div>
            </div>
        </div>
        <div className={isActive ? 'redirectButtons' : 'redirectButtons navActive'}>
            <ul>
                <NavLink to="/" className="current navbarLink"><li>Home</li></NavLink>
                <NavLink to="about" className="current navbarLink"><li>O nas</li></NavLink>
                <NavLink to="menu" className="current navbarLink"><li>Menu</li></NavLink>
                <NavLink to="contact" className="current navbarLink"><li>Kontakt + Praca</li></NavLink>
                <NavLink to="shop" className="current navbarLink"><li>Sklep</li></NavLink>
            </ul>
        </div>
        <div className={isActive ? 'sidebar' : 'sidebar navActive'}>
            <ul>
                <NavLink to="/" className="current sidebarLink"><li><FiHome /> &nbsp;Home</li></NavLink>
                <NavLink to="about" className="current sidebarLink"><li><GoPersonFill /> &nbsp;O nas</li></NavLink>
                <NavLink to="menu" className="current sidebarLink"><li><RiDrinks2Fill /> &nbsp;Menu</li></NavLink>
                <NavLink to="contact" className="current sidebarLink"><li><FiSmartphone /> &nbsp;Kontakt + Praca</li></NavLink>
                <NavLink to="shop" className="current sidebarLink"><li><AiFillShopping />  &nbsp;Sklep</li></NavLink>
            </ul>
        </div>
    </div>
  )
}

export default Navbar
