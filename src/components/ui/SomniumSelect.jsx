import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiSearch } from 'react-icons/fi';

export default function SomniumSelect({ 
    options, 
    value, 
    onChange, 
    placeholder = "Wybierz opcję...", 
    label,
    className = "",
    disabled = false,
    searchable = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    const filteredOptions = searchable && searchQuery.trim()
        ? options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
        : options;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchQuery("");
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, searchable]);

    const handleSelect = (val) => {
        onChange(val);
        setIsOpen(false);
        setSearchQuery("");
    };

    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            {label && (
                <label className="text-xs uppercase tracking-widest font-bold text-white/40 ml-1 mb-2 block">
                    {label}
                </label>
            )}
            
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
                    flex justify-between items-center px-4 py-3 rounded-xl border transition-all duration-300
                    ${disabled ? 'opacity-50 cursor-not-allowed bg-black/10' : 'cursor-pointer'}
                    ${isOpen && !disabled
                        ? 'bg-black/50 border-(--medium-shade) shadow-[0_0_20px_rgba(143,120,93,0.2)]' 
                        : 'bg-black/30 border-white/10 hover:bg-black/40 hover:border-white/20'
                    }
                `}
            >
                <span className={`text-sm tracking-wide ${selectedOption ? 'text-white font-medium' : 'text-white/40'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <FiChevronDown className={`text-(--medium-shade) transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#1a1714] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {searchable && (
                        <div className="p-2 border-b border-white/10">
                            <div className="relative">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Szukaj..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-3 pr-9 text-sm text-white focus:outline-none focus:border-(--medium-shade) transition-colors placeholder-white/30"
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" size={14} />
                            </div>
                        </div>
                    )}
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-white/30 italic text-center">Brak wyników</div>
                        ) : (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => !option.disabled && handleSelect(option.value)}
                                    className={`
                                        px-4 py-3 text-sm transition-colors flex items-center justify-between
                                        ${option.disabled ? 'opacity-30 cursor-not-allowed grayscale' : 'cursor-pointer'}
                                        ${value === option.value 
                                            ? 'bg-(--medium-shade) text-[#24201d] font-bold' 
                                            : !option.disabled ? 'text-white/70 hover:bg-white/5 hover:text-white' : ''
                                        }
                                    `}
                                >
                                    <span className={option.disabled ? 'italic' : ''}>{option.label}</span>
                                    {value === option.value && <div className="w-1.5 h-1.5 rounded-full bg-[#24201d]" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
