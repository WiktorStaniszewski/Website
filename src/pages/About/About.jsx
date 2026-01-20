import React from 'react';
import Parallax from 'src/pages/About/Parallax';
import { FaCoffee, FaHeart, FaLightbulb } from 'react-icons/fa';

const AboutHero = () => (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <span className="text-(--medium-shade) uppercase tracking-[0.3em] text-sm font-bold border-b border-(--medium-shade)/30 pb-2">
                Est. 2023 • Kraków
            </span>
            <h1 className='text-6xl md:text-8xl font-serif font-bold text-(--font-color) drop-shadow-xl'>
                Somnium <span className="block text-4xl md:text-5xl font-light italic mt-2 opacity-80">Cafe Bar</span>
            </h1>
            
            <p className='text-lg md:text-xl leading-relaxed text-(--font-color) max-w-2xl mx-auto pt-4 font-light text-balance drop-shadow-md'>
                Wyjątkowa kawiarnia specialty coffee, która powstała z miłości do doskonałej kawy i niezobowiązującej atmosfery. 
                Znajdujemy się w sercu Krakowa, przy Dolnych Młynów 3/1.
            </p>
        </div>
    </section>
);

const StorySection = () => (
    <section className="relative py-20 px-4 md:px-8 backdrop-brightness-90 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Image Card */}
            <div className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-left duration-1000 h-[400px] md:h-[500px]">
                <img 
                    src="images/Somnium/Somnium-Wide.jpg" 
                    alt="Somnium Interior" 
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                {/* Lighter gradient just for text readability on image */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-8 left-8 right-8 text-center md:text-left">
                     <p className="text-3xl font-serif italic text-white/95 drop-shadow-lg">"Kawa jako doświadczenie"</p>
                </div>
            </div>

            {/* Text Content */}
            <div className="space-y-8 animate-in slide-in-from-right duration-1000">
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-(--font-color)">
                    Filozofia <span className="text-(--medium-shade)">Somnium</span>
                </h2>
                {/* Lighter glass effect */}
                <div className="bg-[#382f27]/30 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl">
                    <p className="text-lg leading-relaxed text-(--font-color)">
                        Nasza nazwa – <strong>"Somnium"</strong> – nawiązuje do jednego z kluczowych aspektów kawy: jej struktury, pełni i bogactwa smaku. 
                        To właśnie te cechy staramy się wydobyć w każdej filiżance espresso.
                    </p>
                    <p className="text-lg leading-relaxed text-(--font-color) mt-4">
                        Wierzymy, że kawa powinna być nie tylko napojem, ale także doświadczeniem, które angażuje wszystkie zmysły.
                    </p>
                </div>
            </div>
        </div>
    </section>
);

const FeaturesSection = () => (
    <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                 <div className="order-2 lg:order-1 space-y-8">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-(--font-color)">
                        Wyjątkowość <br/><span className="italic opacity-80">naszej kawiarni</span>
                    </h2>
                    <div className="backdrop-blur-sm bg-white/5 rounded-3xl p-6 border border-white/5">
                        <p className="text-lg text-(--font-color) leading-relaxed text-justify">
                            Specjalizujemy się w starannie dobranych ziarnach, pochodzących z najlepszych palarni. 
                            Stawiamy na kreatywne podejście – eksperymentujemy z metodami parzenia i proporcjami, 
                            aby każda wizyta w <strong className="text-(--medium-shade)">Somnium</strong> była unikalna. 
                            Nie znajdziesz u nas zbędnego nadęcia – tylko dobrze przygotowane espresso, 
                            cappuccino czy alternatywne metody parzenia.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                        {[
                            { icon: <FaCoffee />, text: "Top Ziarna" },
                            { icon: <FaLightbulb />, text: "Kreatywność" },
                            { icon: <FaHeart />, text: "Bez Napinki" }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center justify-center p-6 bg-[#382f27]/40 backdrop-blur-md rounded-2xl border border-white/10 hover:border-(--medium-shade) transition-colors group">
                                <span className="text-3xl text-(--medium-shade) mb-3 group-hover:scale-110 transition-transform">{item.icon}</span>
                                <span className="text-xs font-bold uppercase tracking-wider text-(--font-color)">{item.text}</span>
                            </div>
                        ))}
                    </div>
                 </div>

                 <div className="order-1 lg:order-2 flex justify-center">
                    <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white/5 shadow-2xl">
                         <img 
                            src="images/coffeebeans.jpg" 
                            alt="Coffee Beans" 
                            className="w-full h-full object-cover opacity-95 hover:opacity-100 transition-opacity duration-500 hover:scale-105 transform"
                        />
                    </div>
                 </div>
            </div>
        </div>
    </section>
);

const PartnersSection = () => (
    // Changed: Lighter gradient, fading to transparent
    <section className="py-20 px-4 backdrop-brightness-95 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl font-serif font-bold mb-16 text-center text-(--font-color)">Nasi Partnerzy</h2>
            <div className="w-full">
                <Parallax />
            </div>
        </div>
    </section>
);


export default function About() {
    return (
        <main className="w-full min-h-screen overflow-x-hidden pt-20">
            <AboutHero />
            <StorySection />
            <FeaturesSection />
            <PartnersSection />
        </main>
    )
}