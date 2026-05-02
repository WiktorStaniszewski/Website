import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function SomniumSelect({ 
    options, 
    value, 
    onChange, 
    placeholder = "Wybierz opcję...", 
    label,
    className = "",
    disabled = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        onChange(val);
        setIsOpen(false);
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
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {options.map((option) => (
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
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
