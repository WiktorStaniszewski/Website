import 'styles/Header.css'
import { useMemo, useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { RiDrinks2Fill } from "react-icons/ri";
import { FiSmartphone } from "react-icons/fi";
import { GoPersonFill } from "react-icons/go";
import { AiFillShopping } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";
import LoginControl from './Login/LoginControl';
import { debounce } from 'lodash';

function Header() {

    const [isShown, setIsShown] = useState(false);

    const debouncedShow = useMemo(
        () => debounce(() => setIsShown(true), 300),
        []
    );

    const debouncedHide = useMemo(
        () => debounce(() => setIsShown(false), 300),
        []
    );

    // ✅ cleanup on unmount (important with debounce)
    useEffect(() => {
        return () => {
        debouncedShow.cancel();
        debouncedHide.cancel();
        };
    }, [debouncedShow, debouncedHide]);

    // hamburgerIcon/sidebar settings - overflow action and buttons functions
    const toggleScroll = (lockScroll) => {
        document.body.style.overflowY = lockScroll ? 'hidden' : 'auto';
    };
    const [isActive, setIsActive] = useState(true);
    const toggleClass = () => {
        setIsActive(prev => {
            const newState = !prev;
            toggleScroll(!newState);
            return newState;
        });
    };
    useEffect(() => {
        return () => {
            toggleScroll() // reset on unmount
        };
    }, []);

    // displaying the logo on the navbar when scrolling
    const [showLogo, setShowLogo] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setShowLogo(window.scrollY > 50);
        };
        
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll)
    }, []);


    return (
        <>
        <div className="headContainer">
            <div className='topHeader'>
                <div className="leftSide">
                    <div className={isActive ? 'hamburgerIcon' : 'hamburgerIcon navActive'}  onClick={toggleClass}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                    <ul className="social-links">
                        <li><FaInstagram /></li>
                        <li><SiGooglemaps /></li>
                        <li></li>
                    </ul>
                </div>
                <Link to="/"><img src="/images/logo body_biale.png" alt="logo"></img></Link>
                <div className='loginCartDiv'>
                    <div className='loginButton headerButton' onMouseEnter={debouncedShow} onMouseLeave={debouncedHide}>
                        <FiUser />
                        {isShown && (
                        <LoginControl /> 
                        )}
                    </div>
                    <div className='cartButton headerButton'>
                        <FiShoppingCart />
                    </div>
                </div>
            </div>
            <div className={isActive ? 'sidebar' : 'sidebar navActive'}>
                <ul>
                    <NavLink to="/" className="current sidebarLink"><li><FiHome /> &nbsp;Home</li></NavLink>
                    <NavLink to="shop" className="current sidebarLink"><li><AiFillShopping />  &nbsp;Sklep</li></NavLink>
                    <NavLink to="menu" className="current sidebarLink"><li><RiDrinks2Fill /> &nbsp;Menu</li></NavLink>
                    <NavLink to="contact" className="current sidebarLink"><li><FiSmartphone /> &nbsp;Kontakt</li></NavLink>
                    <NavLink to="about" className="current sidebarLink"><li><GoPersonFill /> &nbsp;O nas</li></NavLink>
                </ul>
            </div>
        </div>
        <div className="redirectButtons">
            <ul>
                <div className={showLogo ? "logo-visible" : "logo-hidden"}><Link to="/"><img className='navigation-logo' src="/images/logo body_biale.png" alt="logo"></img></Link></div>
                <NavLink to="/" className="current navbarLink"><li>Home</li></NavLink>
                <NavLink to="shop" className="current navbarLink"><li>Sklep</li></NavLink>
                <NavLink to="blog" className="current navbarLink"><li>Blog</li></NavLink>
                <NavLink to="menu" className="current navbarLink"><li>Menu</li></NavLink>
                <NavLink to="contact" className="current navbarLink"><li>Kontakt</li></NavLink>
                <NavLink to="about" className="current navbarLink"><li>O nas</li></NavLink>
            </ul>
        </div>
        </>
        )
    }

export default Header
