import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiMapPin, FiPhone, FiMail, FiArrowRight } from "react-icons/fi";
import { FaTiktok } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto relative z-10 text-(--font-color)">
      {/* Top Gradient/Border Separation */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="w-full bg-(--header-footer-bg)/90 backdrop-blur-xl pt-16 pb-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* 1. Brand & Newsletter */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              {/* Logo Placeholder - Matches your header style */}
              <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden border border-white/5 group-hover:border-(--80-shade) transition-colors">
                 <img src="images/Somnium/SomniumLogo.jpg" alt="Somnium" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-bold tracking-tighter">Somnium</span>
            </Link>
            
            <p className="text-sm opacity-60 leading-relaxed max-w-xs">
              Kawa to nie tylko napój, to doświadczenie. Dołącz do nas i odkryj świat specialty coffee w sercu Krakowa.
            </p>

            {/* Newsletter Input */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-bold uppercase tracking-wider opacity-50">Newsletter</span>
              <form className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Twój email..." 
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-(--80-shade) transition-all placeholder:opacity-30"
                />
                <button className="bg-(--80-shade) hover:bg-(--button-hover-bg) text-white p-2 rounded-lg transition-colors cursor-pointer">
                  <FiArrowRight />
                </button>
              </form>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="flex flex-col gap-6 lg:pl-8">
            <h3 className="font-bold text-lg">Odkrywaj</h3>
            <ul className="flex flex-col gap-3 text-sm opacity-70">
              <li><Link to="/menu" className="hover:text-(--80-shade) hover:opacity-100 transition-colors">Nasze Menu</Link></li>
              <li><Link to="/shop" className="hover:text-(--80-shade) hover:opacity-100 transition-colors">Sklep Online</Link></li>
              <li><Link to="/blog" className="hover:text-(--80-shade) hover:opacity-100 transition-colors">Blog & Wiedza</Link></li>
              <li><Link to="/about" className="hover:text-(--80-shade) hover:opacity-100 transition-colors">O Nas</Link></li>
              <li><Link to="/recruitment" className="hover:text-(--80-shade) hover:opacity-100 transition-colors">Kariera</Link></li>
            </ul>
          </div>

          {/* 3. Account & Help */}
          <div className="flex flex-col gap-6">
            <h3 className="font-bold text-lg">Konto i Pomoc</h3>
            <ul className="flex flex-col gap-3 text-sm opacity-70">
              <li><Link to="/account" className="hover:text-(--80-shade) hover:opacity-100 transition-colors">Moje Konto</Link></li>
              <li><Link to="/cart" className="hover:text-(--80-shade) hover:opacity-100 transition-colors">Koszyk</Link></li>
              <li><Link to="/account?tab=history" className="hover:text-(--80-shade) hover:opacity-100 transition-colors">Śledzenie Zamówienia</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-(--80-shade) hover:opacity-100 transition-colors">Polityka Prywatności</Link></li>
              <li><Link to="/terms" className="hover:text-(--80-shade) hover:opacity-100 transition-colors">Regulamin</Link></li>
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div className="flex flex-col gap-6">
            <h3 className="font-bold text-lg">Kontakt</h3>
            <ul className="flex flex-col gap-4 text-sm opacity-80">
              <li className="flex items-start gap-3">
                <FiMapPin className="mt-1 text-(--80-shade)" />
                <span>
                  ul. Krakowska 14<br />
                  31-062 Kraków, Polska
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-(--80-shade)" />
                <a href="mailto:kontakt@somnium.pl" className="hover:underline">kontakt@somnium.pl</a>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-(--80-shade)" />
                <a href="tel:+48123456789" className="hover:underline">+48 123 456 789</a>
              </li>
            </ul>

            {/* Socials */}
            <div className="flex gap-4 mt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-(--80-shade) flex items-center justify-center transition-all duration-300 border border-white/5 hover:-translate-y-1">
                <FiInstagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-(--80-shade) flex items-center justify-center transition-all duration-300 border border-white/5 hover:-translate-y-1">
                <FiFacebook size={18} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-(--80-shade) flex items-center justify-center transition-all duration-300 border border-white/5 hover:-translate-y-1">
                <FaTiktok size={16} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-40">
          <p>© {currentYear} Somnium Cafe Bar. Wszelkie prawa zastrzeżone.</p>
          <div className="flex gap-6">
            <span className="hover:opacity-100 cursor-pointer transition-opacity">Cookies</span>
            <span className="hover:opacity-100 cursor-pointer transition-opacity">Mapa Strony</span>
            <span className="hover:opacity-100 cursor-pointer transition-opacity">Made by WS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}