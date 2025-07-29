import '../styles/navbar.css'
import { useState } from "react";
import { Link } from 'react-router-dom';
import { FiShoppingCart } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { RiDrinks2Fill } from "react-icons/ri";
import { FiSmartphone } from "react-icons/fi";
import { GoPersonFill } from "react-icons/go";
import { AiFillShopping } from "react-icons/ai";

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
                <div className={isActive ? 'hamburgerIcon' : 'hamburgerIcon active'}  onClick={toggleClass}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            </div>
            <img src="/images/logo body_biale.png" alt="logo"></img>
            <div className='loginCartDiv'>
                <div className='login headerButton'><FiUser /></div>
                <div className='cart headerButton'><FiShoppingCart /></div>
            </div>
        </div>
        <div className={isActive ? 'redirectButtons' : 'redirectButtons active'}>
            <ul>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="../pages/About">O nas</Link></li>
                <li>Menu</li>
                <li>Kontakt + Praca</li>
                <li>Sklep</li>
            </ul>
        </div>
        <div className={isActive ? 'sidebar' : 'sidebar active'}>
            <ul>
                <li><FiHome /> Home</li>
                <li><GoPersonFill /> O nas</li>
                <li><RiDrinks2Fill /> Menu</li>
                <li><FiSmartphone /> Kontakt + Praca</li>
                <li><AiFillShopping />  Sklep</li>
            </ul>
        </div>
    </div>
  )
}

export default Navbar
