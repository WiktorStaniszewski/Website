import React from 'react';
import Parallax from './Parallax';
import { FaCoffee, FaHeart, FaLightbulb } from 'react-icons/fa';

const AboutHero = () => (
    <div className='relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden'>
        {/* Background */}
        <div className="absolute inset-0 z-0">
            <img 
                src="images/Somnium/Somnium-Wide.jpg" 
                alt="Somnium Cafe Interior" 
                className='w-full h-full object-cover object-center scale-105 opacity-80 animate-in fade-in duration-1000' 
            />
            {/* Lighter Gradient: Fades to transparent at top, and matches the next section color (#382f27) at bottom */}
            <div className="absolute inset-0 bg-linear-to-t from-[#382f27] via-[#24201d]/50 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            <div className="border-b border-white/30 pb-2 mb-2">
                <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-white font-bold drop-shadow-md">
                    Est. 2023 • Kraków
                </span>
            </div>

            <h1 className='text-6xl md:text-8xl font-serif font-bold text-white drop-shadow-2xl tracking-wide'>
                Nasza
                <span className="block text-4xl md:text-6xl font-light italic mt-2 text-(--medium-shade) brightness-125">Historia</span>
            </h1>
            
            <p className='text-lg md:text-xl font-light leading-relaxed max-w-2xl text-white/95 drop-shadow-md text-balance'>
                Wyjątkowa kawiarnia specialty coffee, która powstała z miłości do doskonałej kawy i niezobowiązującej atmosfery.
                Znajdujemy się w sercu Krakowa.
            </p>
        </div>
    </div>
);

const StorySection = () => (
    // Changed bg to --80-shade (#382f27) for a lighter brown look
    <section className="relative py-24 px-6 md:px-12 bg-(--80-shade)">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Text Content */}
            <div className="space-y-8 animate-in slide-in-from-left duration-1000">
                <div>
                    <span className="text-(--medium-shade) uppercase tracking-widest text-sm font-bold brightness-110">O nas</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 mb-6 text-(--font-color)">
                        Filozofia <span className="text-(--medium-shade) italic">Somnium</span>
                    </h2>
                </div>
                
                {/* Lighter Glass: bg-white/10 instead of /5 */}
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-xl hover:bg-white/15 transition-colors duration-500">
                    <p className="text-lg leading-relaxed text-(--font-color)">
                        Nasza nazwa – <strong>"Somnium"</strong> – nawiązuje do jednego z kluczowych aspektów kawy: jej struktury, pełni i bogactwa smaku. 
                        To właśnie te cechy staramy się wydobyć w każdej filiżance espresso.
                    </p>
                    <p className="text-lg leading-relaxed text-(--font-color) mt-6 pt-6 border-t border-white/20">
                        Wierzymy, że kawa powinna być nie tylko napojem, ale także doświadczeniem, które angażuje wszystkie zmysły.
                    </p>
                </div>
            </div>

            {/* Image Card */}
            <div className="relative group rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in slide-in-from-right duration-1000 h-[500px]">
                <img 
                    src="images/coffeebeans.jpg" 
                    alt="Coffee Beans" 
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                />
                {/* Lighter gradient overlay on image */}
                <div className="absolute inset-0 bg-linear-to-t from-[#382f27] via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-10 left-10 right-10">
                     <p className="text-3xl font-serif italic text-white drop-shadow-lg border-l-4 border-(--medium-shade) pl-4">
                        "Kawa jako doświadczenie"
                     </p>
                </div>
            </div>
        </div>
    </section>
);

const FeaturesSection = () => (
    // Changed bg to --90-shade (#3f352c) for slight contrast but still lighter than original
    <section className="py-24 px-6 bg-(--90-shade) border-t border-white/10">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 {/* Visual Side */}
                 <div className="order-2 lg:order-1 flex justify-center relative">
                    {/* Brighter Glow */}
                    <div className="absolute inset-0 bg-(--medium-shade) blur-[100px] opacity-20 rounded-full"></div>
                    <div className="relative w-full max-w-md aspect-square rounded-[3rem] overflow-hidden border border-white/20 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700 bg-[#24201d]">
                         <img 
                            src="images/Somnium/Somnium-Wide.jpg" 
                            alt="Somnium Art" 
                            className="w-full h-full object-cover opacity-90"
                        />
                    </div>
                 </div>

                 {/* Text Side */}
                 <div className="order-1 lg:order-2 space-y-10">
                    <div>
                        <span className="text-(--medium-shade) uppercase tracking-widest text-sm font-bold brightness-110">Wartości</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 text-(--font-color)">
                            Wyjątkowość <br/><span className="italic opacity-80 font-light">naszej kawiarni</span>
                        </h2>
                    </div>

                    <div className="prose prose-invert text-lg text-(--font-color) leading-relaxed text-justify">
                        <p>
                            Specjalizujemy się w starannie dobranych ziarnach. Stawiamy na kreatywne podejście – eksperymentujemy z metodami parzenia i proporcjami, 
                            aby każda wizyta w <strong className="text-(--medium-shade) brightness-110">Somnium</strong> była unikalna.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { icon: <FaCoffee />, text: "Top Ziarna" },
                            { icon: <FaLightbulb />, text: "Kreatywność" },
                            { icon: <FaHeart />, text: "Bez Napinki" }
                        ].map((item, i) => (
                            // Brighter cards: bg-white/10 -> hover:bg-white/20
                            <div key={i} className="flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:border-(--medium-shade) hover:bg-white/20 transition-all duration-300 group cursor-default shadow-lg">
                                <span className="text-3xl text-(--medium-shade) mb-3 group-hover:scale-110 transition-transform brightness-110">{item.icon}</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-(--font-color)">{item.text}</span>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
        </div>
    </section>
);

const PartnersSection = () => (
    <section className="py-24 px-4 bg-(--80-shade) relative overflow-hidden border-t border-white/10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-linear-to-r from-transparent via-(--medium-shade) to-transparent opacity-30"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
            <span className="text-(--medium-shade) uppercase tracking-widest text-sm font-bold mb-4 brightness-110">Współpraca</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-16 text-center text-(--font-color)">
                Nasi Partnerzy
            </h2>
            <div className="w-full">
                <Parallax />
            </div>
        </div>
    </section>
);

export default function About() {
    return (
        <main className="w-full min-h-screen bg-(--80-shade)">
            <AboutHero />
            <StorySection />
            <FeaturesSection />
            <PartnersSection />
        </main>
    )
}