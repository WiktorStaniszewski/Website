import React from 'react';
import 'styles/Shop.css';

export default function Recommended({ filters }) {
    const categories = [
        { label: "Wszystko", value: "" },
        { label: "Kawa Ziarnista", value: "Ziarna" },
        { label: "Akcesoria", value: "Zaparzacze" },
        { label: "Matcha i Herbaty", value: "Herbaty" }
    ];

    return (
        <div className='flex flex-col justify-center items-center lg:items-start mb-10 animate-in fade-in duration-500'>
            <h2 className='py-4 font-bold text-xs uppercase tracking-widest text-white/50 mx-5'>Szybkie Filtrowanie</h2>
            <div className='flex flex-wrap gap-3 justify-center lg:justify-start px-4'>
                {categories.map((cat) => {
                    const isActive = filters.category === cat.value;
                    return (
                        <button 
                            key={cat.label} onClick={() => filters.handleCategoryChange(cat.value)} 
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 border cursor-pointer
                                ${isActive ? 'bg-(--medium-shade) text-[#24201d] border-(--medium-shade) shadow-[0_0_15px_rgba(143,120,93,0.3)] scale-105' 
                                : 'bg-[#24201d]/40 text-white/70 border-white/10 hover:border-(--medium-shade)/50 hover:text-white backdrop-blur-md'}
                            `}
                        >{cat.label}</button>
                    );
                })}
            </div>
        </div>
    );
}