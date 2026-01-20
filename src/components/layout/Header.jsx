import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from 'src/context/AuthProvider';
// If you have a CartContext, import it here. Assuming standard context usage:
import { useCart } from 'src/context/CartProvider'; 

import { FaBars, FaTimes, FaShoppingBag, FaUser, FaSignInAlt, FaCog } from "react-icons/fa";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, isAuthenticated } = useAuth();
    
    // Safety check for cart context in case it's not ready
    const cartContext = useCart ? useCart() : { cartItems: [] };
    const cartCount = cartContext?.cartItems?.length || 0;

    const location = useLocation();

    // Handle Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Menu", path: "/menu" },
        { name: "Sklep", path: "/shop" },
        { name: "O nas", path: "/about" },
        { name: "Blog", path: "/blog" },
        { name: "Kontakt", path: "/recruitment" },
    ];

    if (user?.role === 'admin') {
        navLinks.push({ name: "Dashboard", path: "/admin", icon: <FaCog /> });
    }

    return (
        <>
            <header 
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
                    isScrolled 
                    ? "bg-[#24201d]/80 backdrop-blur-md py-3 border-white/10 shadow-lg" 
                    : "bg-transparent py-6 border-transparent"
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    
                    {/* --- Logo --- */}
                    <NavLink to="/" className="relative z-50 group">
                        <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-wider text-(--font-color)">
                            SOMNIUM
                            <span className="block text-[10px] md:text-xs font-sans font-light tracking-[0.4em] opacity-70 group-hover:text-(--medium-shade) transition-colors">
                                CAFE BAR
                            </span>
                        </h1>
                    </NavLink>

                    {/* --- Desktop Navigation --- */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <NavLink 
                                key={link.name} 
                                to={link.path}
                                className={({ isActive }) => 
                                    `text-sm uppercase tracking-widest font-medium relative group py-2 ${
                                        isActive ? "text-(--medium-shade)" : "text-(--font-color)/80 hover:text-(--font-color)"
                                    }`
                                }
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-0 w-0 h-px bg-(--medium-shade) transition-all duration-300 group-hover:w-full"></span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* --- Icons & Actions --- */}
                    <div className="hidden lg:flex items-center gap-6">
                        {/* Cart Icon */}
                        <NavLink to="/cart" className="relative group p-2">
                            <FaShoppingBag className="text-xl text-(--font-color) group-hover:text-(--medium-shade) transition-colors" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-(--medium-shade) text-[#24201d] text-xs font-bold rounded-full shadow-lg border border-[#24201d]">
                                    {cartCount}
                                </span>
                            )}
                        </NavLink>

                        {/* Account Icon */}
                        <NavLink 
                            to={isAuthenticated ? "/account" : "/login"} 
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-(--medium-shade) hover:border-(--medium-shade) hover:text-[#24201d] transition-all duration-300 group"
                        >
                            {isAuthenticated ? <FaUser /> : <FaSignInAlt />}
                            <span className="text-xs uppercase font-bold tracking-wider">
                                {isAuthenticated ? "Konto" : "Login"}
                            </span>
                        </NavLink>
                    </div>

                    {/* --- Mobile Hamburger --- */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden relative z-50 p-2 text-(--font-color) hover:text-(--medium-shade) transition-colors"
                    >
                        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </header>

            {/* --- Mobile Menu Overlay --- */}
            <div 
                className={`fixed inset-0 z-40 bg-[#24201d] transition-all duration-500 ease-in-out lg:hidden flex flex-col justify-center items-center gap-8 ${
                    isMobileMenuOpen 
                    ? "opacity-100 visible translate-y-0" 
                    : "opacity-0 invisible -translate-y-10"
                }`}
            >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-(--medium-shade)/10 rounded-full blur-[80px] pointer-events-none"></div>

                <nav className="flex flex-col items-center gap-6 text-center">
                    {navLinks.map((link, idx) => (
                        <NavLink 
                            key={link.name} 
                            to={link.path}
                            className="text-3xl font-serif font-bold text-(--font-color) hover:text-(--medium-shade) transition-colors"
                            style={{ transitionDelay: `${idx * 50}ms` }} // Stagger animation
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="w-16 h-px bg-white/10 my-4"></div>

                <div className="flex gap-8">
                    <NavLink to="/cart" className="flex flex-col items-center gap-2 text-(--font-color)">
                        <div className="relative p-4 bg-white/5 rounded-full border border-white/10">
                            <FaShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-5 h-5 bg-(--medium-shade) text-[#24201d] text-xs font-bold rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <span className="text-xs uppercase tracking-widest opacity-70">Koszyk</span>
                    </NavLink>

                    <NavLink to={isAuthenticated ? "/account" : "/login"} className="flex flex-col items-center gap-2 text-(--font-color)">
                        <div className="p-4 bg-white/5 rounded-full border border-white/10">
                            {isAuthenticated ? <FaUser size={20} /> : <FaSignInAlt size={20} />}
                        </div>
                        <span className="text-xs uppercase tracking-widest opacity-70">
                            {isAuthenticated ? "Profil" : "Zaloguj"}
                        </span>
                    </NavLink>
                </div>
            </div>
        </>
    );
}