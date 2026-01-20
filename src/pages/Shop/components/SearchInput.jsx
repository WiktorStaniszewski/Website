import React from 'react';
import { FiSearch, FiX } from "react-icons/fi";

export default function SearchInput({ value, onChange, placeholder = "Szukaj produktów...", className = "" }) {
  
  const handleClear = () => {
    if (onChange) onChange({ target: { value: "" } });
  };

  return (
    <div className={`relative w-full group ${className}`}>
      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-(--medium-shade) transition-colors duration-300 pointer-events-none">
        <FiSearch size={20} />
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#24201d]/30 hover:bg-[#24201d]/50 focus:bg-[#24201d]/50 backdrop-blur-md border border-white/10 focus:border-(--medium-shade) rounded-2xl py-3 text-(--font-color) placeholder-white/30 outline-none transition-all duration-300 shadow-inner group-hover:border-white/20 pl-12!"
      />

      {/* Clear Button */}
      <div 
        className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-300 z-10 ${
            value ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-75'
        }`}
      >
        <button 
            onClick={handleClear}
            className="p-1.5 rounded-full bg-white/5 hover:bg-(--medium-shade) text-white/60 hover:text-[#24201d] transition-all cursor-pointer"
            title="Wyczyść"
        >
            <FiX size={14} />
        </button>
      </div>
    </div>
  );
}