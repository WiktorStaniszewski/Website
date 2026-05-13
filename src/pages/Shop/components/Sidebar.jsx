import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import 'styles/Shop.css';
import { FiX, FiFilter } from 'react-icons/fi';
import { useViewport } from 'hooks/useViewport';

const RadioOption = React.memo(({ label, name, value, checkedValue, onChange }) => {
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
});

const SidebarContent = React.memo(({ filters }) => {
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
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm uppercase tracking-widest text-white/50 font-bold">Cena</h3>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
                <button 
                  onClick={() => filters.handlePriceRangeChange([0, 50])}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${filters.priceRange[0] === 0 && filters.priceRange[1] === 50 ? 'bg-(--medium-shade) text-[#24201d] border-(--medium-shade)' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'}`}
                >Do 50 zł</button>
                <button 
                  onClick={() => filters.handlePriceRangeChange([0, 75])}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${filters.priceRange[0] === 0 && filters.priceRange[1] === 75 ? 'bg-(--medium-shade) text-[#24201d] border-(--medium-shade)' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'}`}
                >Do 75 zł</button>
                <button 
                  onClick={() => filters.handlePriceRangeChange([0, 100])}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${filters.priceRange[0] === 0 && filters.priceRange[1] === 100 ? 'bg-(--medium-shade) text-[#24201d] border-(--medium-shade)' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'}`}
                >Do 100 zł</button>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <input 
                        type="number" 
                        min="0"
                        value={filters.priceRange[0] === 0 && filters.priceRange[1] === 500 && filters.priceRange[0] === 0 ? '' : filters.priceRange[0]} 
                        onChange={(e) => filters.handlePriceRangeChange([e.target.value === '' ? '' : Number(e.target.value), filters.priceRange[1]])}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:border-(--medium-shade) outline-none transition-colors"
                        placeholder="Od"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 font-bold">zł</span>
                </div>
                <span className="text-white/30 font-bold">-</span>
                <div className="relative flex-1">
                    <input 
                        type="number" 
                        min="0"
                        value={filters.priceRange[1] === 500 && filters.priceRange[0] === 0 ? '' : filters.priceRange[1]} 
                        onChange={(e) => filters.handlePriceRangeChange([filters.priceRange[0], e.target.value === '' ? '' : Number(e.target.value)])}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:border-(--medium-shade) outline-none transition-colors"
                        placeholder="Do"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 font-bold">zł</span>
                </div>
            </div>
        </fieldset>
    </div>
  );
});

function Sidebar({ filters, isFilterMenuOpen, toggleFilterMenu }) {
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
        <div className="absolute bottom-0 w-full p-6 pb-12 border-t border-white/10 bg-[#24201d]/90 backdrop-blur-md shrink-0">
              <button onClick={toggleFilterMenu} className="w-full py-4 bg-(--medium-shade) hover:brightness-110 text-[#24201d] font-bold text-lg rounded-2xl shadow-[0_0_20px_rgba(143,120,93,0.3)] active:scale-95 transition-all cursor-pointer">Pokaż Wyniki</button>
        </div>
      </aside>,
      document.body
    );
  }

  return null;
}

export default React.memo(Sidebar);