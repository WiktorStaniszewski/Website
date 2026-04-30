import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiChevronDown, FiCheck, FiX } from 'react-icons/fi';
import ReactSlider from 'react-slider';

const Dropdown = ({ label, children, isOpen, onToggle, isActive }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(!isOpen);
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 hover:bg-white/10 cursor-pointer ${
          isOpen 
            ? 'border-(--medium-shade) bg-white/5 shadow-[0_0_15px_rgba(143,120,93,0.2)]' 
            : isActive 
              ? 'border-(--medium-shade)/50 bg-(--medium-shade)/10 text-white'
              : 'border-white/10 bg-black/20 text-white/60'
        }`}
      >
        <span className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>{label}</span>
        <FiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-100 min-w-[220px] bg-[#24201d] border border-white/10 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

export default function FilterBar({ filters }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = useCallback((name) => {
    setOpenDropdown(current => current === name ? null : name);
  }, []);

  const categories = [
    { label: "Wszystko", value: "" },
    { label: "Kawa Ziarnista", value: "Ziarna" },
    { label: "Zaparzacze", value: "Zaparzacze" },
    { label: "Herbaty / Matcha", value: "Herbaty" },
    { label: "Filtry", value: "Filtry" },
    { label: "Kubki i Szkło", value: "Kubki" }
  ];

  const purposes = [
    { label: "Dowolne", value: "" },
    { label: "Pod Filtr", value: "filtr" },
    { label: "Pod Espresso", value: "espresso" },
    ...(filters.category === "Zaparzacze" ? [{ label: "Kawiarka", value: "kawiarka" }] : [])
  ];

  const processes = [
    { label: "Wszystkie", value: "" },
    { label: "Myta (Washed)", value: "washed" },
    { label: "Naturalna (Natural)", value: "natural" },
    { label: "Inne (Honey, Decaf)", value: "honey" }
  ];

  const sortOptions = [
    { label: "Najnowsze", value: "newest" },
    { label: "Najtańsze", value: "price-asc" },
    { label: "Najdroższe", value: "price-desc" }
  ];

  const currentCategoryLabel = categories.find(c => c.value === filters.category)?.label || "Kategoria";
  const currentPurposeLabel = purposes.find(p => p.value === filters.purpose)?.label || "Przeznaczenie";
  const currentProcessLabel = processes.find(p => p.value === filters.processing)?.label || "Metoda";
  const currentSortLabel = sortOptions.find(o => o.value === filters.sortBy)?.label || "Sortuj";

  const hasActiveFilters = filters.category || filters.purpose || filters.processing || filters.showOnlyAvailable || filters.priceRange[0] !== 0 || filters.priceRange[1] !== 500;

  return (
    <div className="hidden lg:flex items-center justify-between w-full bg-black/20 backdrop-blur-md border border-white/5 rounded-2xl p-3 mb-6 shadow-lg z-40 relative">
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-widest text-white/30 font-bold ml-2 mr-1">Filtry:</span>
        
        {/* Category */}
        <Dropdown 
          label={currentCategoryLabel}
          isActive={!!filters.category}
          isOpen={openDropdown === 'category'}
          onToggle={() => toggleDropdown('category')}
        >
          <div className="flex flex-col gap-1">
            {categories.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  filters.handleCategoryChange(option.value);
                  setOpenDropdown(null);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  filters.category === option.value ? 'bg-(--medium-shade)/20 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {option.label}
                {filters.category === option.value && <FiCheck className="text-(--medium-shade)" />}
              </button>
            ))}
          </div>
        </Dropdown>

        {/* Purpose (Conditional) */}
        {(filters.category === "Ziarna" || filters.category === "Zaparzacze") && (
          <Dropdown 
            label={currentPurposeLabel}
            isActive={!!filters.purpose}
            isOpen={openDropdown === 'purpose'}
            onToggle={() => toggleDropdown('purpose')}
          >
            <div className="flex flex-col gap-1">
              {purposes.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    filters.handlePurposeChange(option.value);
                    setOpenDropdown(null);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                    filters.purpose === option.value ? 'bg-(--medium-shade)/20 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {option.label}
                  {filters.purpose === option.value && <FiCheck className="text-(--medium-shade)" />}
                </button>
              ))}
            </div>
          </Dropdown>
        )}

        {/* Processing (Conditional) */}
        {filters.category === "Ziarna" && (
          <Dropdown 
            label={currentProcessLabel}
            isActive={!!filters.processing}
            isOpen={openDropdown === 'processing'}
            onToggle={() => toggleDropdown('processing')}
          >
            <div className="flex flex-col gap-1">
              {processes.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    filters.handleProcessingChange(option.value);
                    setOpenDropdown(null);
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                    filters.processing === option.value ? 'bg-(--medium-shade)/20 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {option.label}
                  {filters.processing === option.value && <FiCheck className="text-(--medium-shade)" />}
                </button>
              ))}
            </div>
          </Dropdown>
        )}

        {/* Price Dropdown */}
        <Dropdown 
          label={`Cena: ${filters.priceRange[0]} - ${filters.priceRange[1]} zł`}
          isActive={filters.priceRange[0] !== 0 || filters.priceRange[1] !== 500}
          isOpen={openDropdown === 'price'}
          onToggle={() => toggleDropdown('price')}
        >
          <div className="pt-2 pb-4">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-(--medium-shade)">Zakres cen</span>
              <span className="text-[10px] text-white/40 font-mono">{filters.priceRange[0]}zł - {filters.priceRange[1]}zł</span>
            </div>
            <div className="px-2">
              <ReactSlider
                className="w-full h-1 bg-white/10 rounded-full flex items-center"
                thumbClassName="w-4 h-4 bg-(--medium-shade) rounded-full shadow-[0_0_10px_rgba(143,120,93,0.5)] cursor-grab outline-none"
                trackClassName="bg-(--medium-shade) h-1 rounded-full"
                min={0} max={500} step={10} value={filters.priceRange}
                onChange={filters.handlePriceRangeChange}
              />
            </div>
          </div>
        </Dropdown>

        {/* Availability Toggle */}
        <button 
          type="button"
          onClick={() => filters.handleAvailabilityChange(!filters.showOnlyAvailable)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
            filters.showOnlyAvailable 
              ? 'border-(--medium-shade) bg-(--medium-shade)/10 text-white shadow-[0_0_10px_rgba(143,120,93,0.1)]' 
              : 'border-white/5 bg-black/20 text-white/60 hover:bg-white/5'
          }`}
        >
          <span className="text-sm font-medium">Dostępne</span>
          {filters.showOnlyAvailable && <FiCheck className="text-(--medium-shade)" />}
        </button>

        {hasActiveFilters && (
          <button 
            type="button"
            onClick={filters.resetFilters}
            className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all hover:scale-105 active:scale-95"
            title="Wyczyść wszystkie filtry"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-6 pr-2">
        {/* Sort Dropdown */}
        <Dropdown 
          label={currentSortLabel}
          isOpen={openDropdown === 'sort'}
          onToggle={() => toggleDropdown('sort')}
        >
          <div className="flex flex-col gap-1">
            {sortOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  filters.handleSortChange(option.value);
                  setOpenDropdown(null);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  filters.sortBy === option.value ? 'bg-(--medium-shade)/20 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {option.label}
                {filters.sortBy === option.value && <FiCheck className="text-(--medium-shade)" />}
              </button>
            ))}
          </div>
        </Dropdown>

        <div className="h-8 w-px bg-white/5"></div>

        <span className="text-sm font-bold text-white/80 whitespace-nowrap">
          {filters.filteredProducts.length} <span className="text-white/30 font-normal ml-1">produktów</span>
        </span>
      </div>
    </div>
  );
}
