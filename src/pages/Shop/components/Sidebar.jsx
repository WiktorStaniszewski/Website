import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import 'styles/Shop.css';
import { FiX, FiFilter } from 'react-icons/fi';
import ReactSlider from 'react-slider';
import { useViewport } from 'hooks/useViewport';

const RadioOption = ({ label, name, value, checkedValue, onChange }) => {
  const isChecked = checkedValue === value;
  
  return (
    <label className="group flex items-center cursor-pointer py-2.5 px-2 -mx-2 rounded-xl hover:bg-white/5 transition-all duration-300">
      <input
        type="radio" name={name} value={value} checked={isChecked} onChange={(e) => onChange(e.target.value)}
        className="sr-only peer"
      />
      <div className={`w-5 h-5 mr-3 rounded-full border flex items-center justify-center transition-all duration-300
        ${isChecked ? 'border-(--medium-shade) bg-(--medium-shade)/10' : 'border-white/20 bg-black/30 group-hover:border-white/40'}
      `}>
        <div className={`w-2.5 h-2.5 rounded-full bg-(--medium-shade) shadow-[0_0_8px_rgba(143,120,93,0.6)] transition-all duration-300
          ${isChecked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
        `} />
      </div>
      <span className={`text-sm tracking-wide transition-colors duration-300 ${isChecked ? 'text-white font-bold' : 'text-white/60 group-hover:text-white'}`}>
        {label}
      </span>
    </label>
  );
};

const SidebarContent = ({ filters }) => {
  const currentCategory = filters.category || "";

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-0 pr-2 lg:pr-4 space-y-8 pb-32 lg:pb-0">
        <fieldset>
            <h3 className="text-sm uppercase tracking-widest text-white/50 font-bold mb-4">Kategoria</h3>
            <div className="flex flex-col gap-1">
                <RadioOption label="Wszystko" name="category" value="" checkedValue={currentCategory} onChange={filters.handleCategoryChange} />
                <RadioOption label="Kawa Ziarnista" name="category" value="Ziarna" checkedValue={currentCategory} onChange={filters.handleCategoryChange} />
                <RadioOption label="Zaparzacze" name="category" value="Zaparzacze" checkedValue={currentCategory} onChange={filters.handleCategoryChange} />
                <RadioOption label="Herbaty / Matcha" name="category" value="Herbaty" checkedValue={currentCategory} onChange={filters.handleCategoryChange} />
                <RadioOption label="Filtry" name="category" value="Filtry" checkedValue={currentCategory} onChange={filters.handleCategoryChange} />
                <RadioOption label="Kubki i Szkło" name="category" value="Kubki" checkedValue={currentCategory} onChange={filters.handleCategoryChange} />
            </div>
        </fieldset>

        <div className="h-px bg-white/5 w-full"></div>

        {(currentCategory === "Ziarna" || currentCategory === "Zaparzacze") && (
            <fieldset className="animate-in fade-in slide-in-from-top-2">
                <h3 className="text-sm uppercase tracking-widest text-white/50 font-bold mb-4">Przeznaczenie</h3>
                <div className="flex flex-col gap-1">
                    <RadioOption label="Dowolne" name="purpose" value="" checkedValue={filters.purpose} onChange={filters.handlePurposeChange} />
                    <RadioOption label="Pod Filtr" name="purpose" value="filtr" checkedValue={filters.purpose} onChange={filters.handlePurposeChange} />
                    <RadioOption label="Pod Espresso" name="purpose" value="espresso" checkedValue={filters.purpose} onChange={filters.handlePurposeChange} />
                    {currentCategory === "Zaparzacze" && <RadioOption label="Kawiarka" name="purpose" value="kawiarka" checkedValue={filters.purpose} onChange={filters.handlePurposeChange} />}
                </div>
            </fieldset>
        )}

        {currentCategory === "Ziarna" && (
            <>
                <div className="h-px bg-white/5 w-full"></div>
                <fieldset className="animate-in fade-in slide-in-from-top-2">
                    <h3 className="text-sm uppercase tracking-widest text-white/50 font-bold mb-4">Metoda Obróbki</h3>
                    <div className="flex flex-col gap-1">
                        <RadioOption label="Wszystkie" name="processing" value="" checkedValue={filters.processing} onChange={filters.handleProcessingChange} />
                        <RadioOption label="Myta (Washed)" name="processing" value="washed" checkedValue={filters.processing} onChange={filters.handleProcessingChange} />
                        <RadioOption label="Naturalna (Natural)" name="processing" value="natural" checkedValue={filters.processing} onChange={filters.handleProcessingChange} />
                        <RadioOption label="Inne (Honey, Decaf)" name="processing" value="honey" checkedValue={filters.processing} onChange={filters.handleProcessingChange} />
                    </div>
                </fieldset>
            </>
        )}

        <div className="h-px bg-white/5 w-full mt-8"></div>

        <fieldset className="mt-8 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm uppercase tracking-widest text-white/50 font-bold">Cena</h3>
                <span className="text-xs font-bold text-(--medium-shade) bg-(--medium-shade)/10 px-2 py-1 rounded-md">
                    {filters.priceRange[0]} zł - {filters.priceRange[1]} zł
                </span>
            </div>
            
            <div className="px-2">
                <ReactSlider
                    className="w-full h-1 bg-white/10 rounded-full flex items-center"
                    thumbClassName="w-5 h-5 bg-(--medium-shade) rounded-full shadow-[0_0_10px_rgba(143,120,93,0.8)] cursor-grab outline-none flex items-center justify-center hover:scale-110 transition-transform"
                    trackClassName="bg-(--medium-shade) h-1 rounded-full"
                    min={0} max={500} step={10} value={filters.priceRange}
                    onChange={(newRange) => { if(filters.handlePriceRangeChange) filters.handlePriceRangeChange(newRange); }}
                    renderThumb={({ key, ...restProps }) => (
                        <div key={key} {...restProps}><div className="w-2 h-2 bg-[#24201d] rounded-full"></div></div>
                    )}
                />
            </div>
            <div className="flex justify-between text-[10px] text-white/40 mt-3 px-1 font-mono">
                <span>0 zł</span><span>500+ zł</span>
            </div>
        </fieldset>
    </div>
  );
};

export default function Sidebar({ filters, isFilterMenuOpen, toggleFilterMenu }) {
  const { isMobile } = useViewport();

  useEffect(() => {
    if (isMobile && isFilterMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobile, isFilterMenuOpen]);

  if (isMobile) {
    return createPortal(
      <aside className={`fixed inset-0 z-999 bg-[#24201d] transition-all duration-300 ease-in-out flex flex-col ${
          isFilterMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-8 invisible pointer-events-none"
        }`}>
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#24201d] shrink-0">
            <h2 className="text-2xl font-serif font-bold flex items-center gap-3 text-white">
                <FiFilter className="text-(--medium-shade)" /> Filtry
            </h2>
            <button onClick={toggleFilterMenu} className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white cursor-pointer"><FiX size={20} /></button>
        </div>
        <SidebarContent filters={filters} />
        <div className="absolute bottom-0 w-full p-6 border-t border-white/10 bg-[#24201d]/90 backdrop-blur-md shrink-0 pb-safe-area">
              <button onClick={toggleFilterMenu} className="w-full py-4 bg-(--medium-shade) hover:brightness-110 text-[#24201d] font-bold text-lg rounded-2xl shadow-[0_0_20px_rgba(143,120,93,0.3)] active:scale-95 transition-all cursor-pointer">Pokaż Wyniki</button>
        </div>
      </aside>,
      document.body
    );
  }

  return (
    <aside className="hidden lg:flex flex-col w-full max-w-[280px] sticky top-56 mt-25 rounded-2xl bg-[#24201d]/20">
        <div className="backdrop-brightness-95 border border-white/10 p-6 rounded-2xl shadow-lg h-full overflow-hidden flex flex-col">
            <SidebarContent filters={filters} />
        </div>
    </aside>
  );
}