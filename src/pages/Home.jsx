import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaPlus, FaMinus, FaCoffee, FaStar, FaLeaf } from "react-icons/fa";

// --- Components ---

const HeroSection = () => (
    <div className='relative w-full h-screen overflow-hidden flex items-center justify-center'>
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
            <img 
                src="images/tlo1.jpg" 
                alt="Somnium Cafe Interior" 
                className='w-full h-full object-cover object-center scale-105 animate-in fade-in duration-1000' 
            />
            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-linear-to-t from-[#24201d] via-[#24201d]/60 to-black/30" />
        </div>

        {/* Hero Content */}
        <div className='relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-1000 fill-mode-both'>
            
            <div className="border-b border-white/20 pb-2 mb-2">
                <span className="text-xs md:text-sm uppercase tracking-[0.3em] opacity-80 text-(--font-color)">
                    Est. 2023 • Kraków
                </span>
            </div>

            <h1 className='text-6xl md:text-8xl font-serif font-bold text-(--font-color) drop-shadow-2xl tracking-wide'>
                Somnium
                <span className="block text-3xl md:text-5xl font-light italic mt-2 opacity-90">Cafe Bar</span>
            </h1>
            
            <p className='text-lg md:text-xl font-light leading-relaxed max-w-2xl opacity-90 text-balance'>
                Kawiarnia z segmentu Specialty Coffee. <br className="hidden md:block"/>
                Kreatywnie w temacie kawy! Zero napinki, tylko dobre szoty.
            </p>

            <div className="pt-6">
                <NavLink 
                    to="/menu" 
                    className="group relative px-8 py-4 bg-white/5 hover:bg-(--medium-shade) backdrop-blur-md border border-white/20 rounded-full transition-all duration-300 overflow-hidden"
                >
                    <span className="relative z-10 text-(--font-color) group-hover:text-[#24201d] font-bold uppercase tracking-widest text-sm transition-colors">
                        Zobacz Menu
                    </span>
                </NavLink>
            </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-bounce opacity-50">
             <div className="w-px h-16 bg-linear-to-b from-transparent via-white to-transparent"></div>
        </div>
    </div>
);

const FeatureIcons = () => (
    <div className="w-full bg-[#24201d] py-12 border-b border-white/5 relative z-20 -mt-8 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex flex-wrap justify-center gap-8 md:gap-24 text-(--font-color) opacity-80">
            <div className="flex flex-col items-center gap-2">
                <FaCoffee className="text-3xl text-(--medium-shade)" />
                <span className="text-xs uppercase tracking-widest">Specialty Coffee</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <FaLeaf className="text-3xl text-(--medium-shade)" />
                <span className="text-xs uppercase tracking-widest">100% Arabica</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <FaStar className="text-3xl text-(--medium-shade)" />
                <span className="text-xs uppercase tracking-widest">Premium Quality</span>
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
                    ? 'bg-(--80-shade) border-(--medium-shade) shadow-lg scale-[1.02]' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                }
            `}
        >
            <div className='flex justify-between items-center p-6'>
                <h3 className={`font-serif text-lg md:text-xl transition-colors ${isOpen ? 'text-(--medium-shade)' : 'text-(--font-color)'}`}>
                    {title}
                </h3>
                <span className={`text-sm transition-transform duration-300 ${isOpen ? 'rotate-180 text-(--medium-shade)' : 'text-white/50'}`}>
                    {isOpen ? <FaMinus /> : <FaPlus />}
                </span>
            </div>
            
            <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className='p-6 pt-0 text-base md:text-lg leading-relaxed text-white/80 border-t border-white/5 mt-2'>
                    {content}
                </div>
            </div>
        </div>
    )
}

const FAQSection = () => {
    // Independent state for accordion behavior
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
        <div className='flex justify-center items-center flex-col px-4 py-20'>
            <div className="text-center mb-12">
                <span className="text-(--medium-shade) uppercase tracking-widest text-sm font-bold">Wiedza & Info</span>
                <h2 className='font-serif font-bold text-4xl md:text-5xl mt-2 mb-4 text-(--font-color)'>
                    Częste Pytania
                </h2>
                <div className="w-24 h-1 bg-(--medium-shade) mx-auto rounded-full opacity-50"></div>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-3xl">
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

// --- Main Page ---

export default function Home() {
    return (
        <main className="w-full min-h-screen bg-[#24201d]">
            <HeroSection />
            <FeatureIcons />
            <FAQSection />
        </main>
    )
}