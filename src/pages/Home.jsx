import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaPlus, FaMinus, FaCoffee, FaStar, FaLeaf } from "react-icons/fa";

const HeroSection = () => (
    <div className='relative w-full h-screen overflow-hidden flex items-center justify-center'>
        <div className="absolute inset-0 z-0">
            <img 
                src="images/tlo1.jpg" 
                alt="Somnium Cafe Interior" 
                className='w-full h-full object-cover object-center scale-105 animate-in fade-in duration-1000' 
            />
            <div className="absolute inset-0 bg-linear-to-t from-(--80-shade) via-(--80-shade)/40 to-black/20" />
        </div>

        <div className='relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-1000 fill-mode-both'>
            
            <div className="border-b border-white/30 pb-2 mb-2">
                <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-white font-bold drop-shadow-md">
                    Est. 2023 • Kraków
                </span>
            </div>

            <h1 className='text-6xl md:text-8xl font-serif font-bold text-white drop-shadow-2xl tracking-wide'>
                Somnium
                <span className="block text-3xl md:text-5xl font-light italic mt-2 text-(--medium-shade) brightness-125">Cafe Bar</span>
            </h1>
            
            <p className='text-lg md:text-xl font-light leading-relaxed max-w-2xl text-white/95 drop-shadow-md text-balance'>
                Kawiarnia z segmentu Specialty Coffee. <br className="hidden md:block"/>
                Kreatywnie w temacie kawy! Zero napinki, tylko dobre szoty.
            </p>

            <div className="pt-6">
                <NavLink 
                    to="/menu" 
                    className="group relative px-8 py-4 bg-white/10 hover:bg-(--medium-shade) backdrop-blur-md border border-white/20 rounded-full transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(143,120,93,0.4)]"
                >
                    <span className="relative z-10 text-white font-bold uppercase tracking-widest text-sm transition-colors group-hover:text-[#24201d]">
                        Zobacz Menu
                    </span>
                </NavLink>
            </div>
        </div>
        <div className="absolute bottom-10 animate-bounce opacity-60">
             <div className="w-px h-16 bg-linear-to-b from-transparent via-white to-transparent"></div>
        </div>
    </div>
);

const FeatureIcons = () => (
    <div className="w-full bg-(--80-shade) py-12 border-b border-white/10 relative z-20 -mt-8 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        <div className="flex flex-wrap justify-center gap-8 md:gap-24 text-(--font-color)">
            <div className="flex flex-col items-center gap-2 group cursor-default">
                <div className="p-4 rounded-full bg-white/5 border border-white/5 group-hover:border-(--medium-shade)/30 transition-colors">
                    <FaCoffee className="text-3xl text-(--medium-shade) group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-xs uppercase tracking-widest opacity-80 font-bold">Specialty Coffee</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-default">
                <div className="p-4 rounded-full bg-white/5 border border-white/5 group-hover:border-(--medium-shade)/30 transition-colors">
                    <FaLeaf className="text-3xl text-(--medium-shade) group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-xs uppercase tracking-widest opacity-80 font-bold">100% Arabica</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-default">
                <div className="p-4 rounded-full bg-white/5 border border-white/5 group-hover:border-(--medium-shade)/30 transition-colors">
                     <FaStar className="text-3xl text-(--medium-shade) group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-xs uppercase tracking-widest opacity-80 font-bold">Premium Quality</span>
            </div>
        </div>
    </div>
);

const QuestionField = ({ title, content, isOpen, onClick }) => {
    return (
        <div 
            onClick={onClick} 
            className={`
                group cursor-pointer rounded-2xl border transition-all duration-300 ease-out overflow-hidden
                ${isOpen 
                    ? 'bg-white/15 border-(--medium-shade)/50 shadow-[0_0_20px_rgba(0,0,0,0.1)]' 
                    : 'bg-white/10 border-white/10 hover:bg-white/20 hover:border-white/20'
                }
            `}
        >
            <div className='flex justify-between items-center p-6'>
                <h3 className={`font-serif text-lg md:text-xl transition-colors ${isOpen ? 'text-(--medium-shade) brightness-110' : 'text-(--font-color)'}`}>
                    {title}
                </h3>
                <span className={`text-sm transition-transform duration-300 ${isOpen ? 'rotate-180 text-(--medium-shade)' : 'text-white/50'}`}>
                    {isOpen ? <FaMinus /> : <FaPlus />}
                </span>
            </div>
            
            <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className='p-6 pt-0 text-base md:text-lg leading-relaxed text-white/80 border-t border-white/10 mt-2 font-light'>
                    {content}
                </div>
            </div>
        </div>
    )
}

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0); 

    const questions = [
        {
            title: "Co to jest Premium Shot?",
            content: "Odkryj espresso w nieoczywistej odsłonie! Nasz PREMIUM SHOT to wyjątkowa selekcja ziaren z przeróżnych krajów, które zachwycają owocowym charakterem, przyjemną kwasowością oraz pełnią aromatu. Jest to espresso dla poszukiwaczy niespotykanych doznań smakowych."
        },
        {
            title: "Czy macie opcje wegańskie?",
            content: "Tak! Posiadamy szeroki wybór mlek roślinnych (owsiane, grochowe, migdałowe) bez dodatkowych opłat, a także wegańskie ciasta wypiekane na miejscu."
        },
        {
            title: "Czy można zarezerwować stolik?",
            content: "Oczywiście. Rezerwacje przyjmujemy telefonicznie lub przez nasze social media. W weekendy zalecamy kontakt z jednodniowym wyprzedzeniem."
        },
        {
            title: "Skąd pochodzą Wasze ziarna?",
            content: "Współpracujemy z najlepszymi polskimi i europejskimi palarniami segmentu Specialty, takimi jak Audun, Hard Beans czy La Cabra. Nasza oferta zmienia się cyklicznie."
        }
    ];

    return (
        <div className='flex justify-center items-center flex-col px-4 py-20 relative overflow-hidden'>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-(--medium-shade)/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

            <div className="text-center mb-12 relative z-10">
                <span className="text-(--medium-shade) uppercase tracking-widest text-sm font-bold brightness-110">Wiedza & Info</span>
                <h2 className='font-serif font-bold text-4xl md:text-5xl mt-2 mb-4 text-(--font-color)'>
                    Częste Pytania
                </h2>
                <div className="w-24 h-1 bg-(--medium-shade) mx-auto rounded-full opacity-60"></div>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-3xl relative z-10">
                {questions.map((q, index) => (
                    <QuestionField 
                        key={index}
                        title={q.title} 
                        content={q.content}
                        isOpen={openIndex === index}
                        onClick={() => setOpenIndex(index === openIndex ? null : index)}
                    />
                ))}
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <main className="w-full min-h-screen bg-(--80-shade)">
            <HeroSection />
            <FeatureIcons />
            <FAQSection />
        </main>
    )
}