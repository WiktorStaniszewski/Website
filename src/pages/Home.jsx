import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaPlus, FaMinus, FaCoffee, FaStar, FaLeaf } from "react-icons/fa";
import { FiCoffee, FiZap, FiSettings, FiPackage, FiArrowRight } from "react-icons/fi";
import BugReportSection from './BugReportSection';

const HeroSection = () => (
    <div className='relative w-full h-screen overflow-hidden flex items-center justify-center'>
        <div className="absolute inset-0 z-0">
            <img
                src="images/tlo1.jpg"
                alt="Somnium Cafe Interior"
                fetchPriority="high"
                loading="eager"
                className='w-full h-full object-cover object-center scale-105 animate-in fade-in duration-1000'
            />
            <div className="absolute inset-0 bg-linear-to-t from-(--darker-bg) via-(--darker-bg)/40 to-black/20" />
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
                Kawiarnia z segmentu Specialty Coffee. <br className="hidden md:block" />
                Kreatywnie w temacie kawy! Zero napinki, tylko dobre szoty.
            </p>

            <div className="pt-6 flex flex-wrap justify-center gap-4">
                <NavLink
                    to="/menu"
                    className="group relative px-8 py-4 bg-white/10 hover:bg-(--medium-shade) backdrop-blur-md border border-white/20 rounded-full transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(143,120,93,0.4)] cursor-pointer"
                >
                    <span className="relative z-10 text-white font-bold uppercase tracking-widest text-sm transition-colors group-hover:text-[#24201d]">
                        Zobacz Menu
                    </span>
                </NavLink>
                <NavLink
                    to="/shop"
                    className="group relative px-8 py-4 bg-(--medium-shade) hover:bg-black/10 backdrop-blur-md border border-(--medium-shade) rounded-full transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
                >
                    <span className="relative z-10 text-[#24201d] font-bold uppercase tracking-widest text-sm transition-colors group-hover:text-[#24201d]">
                        Sklep Online
                    </span>
                </NavLink>
            </div>
        </div>
        <div className="absolute bottom-10 animate-bounce opacity-60">
            <div className="w-px h-16 bg-linear-to-b from-transparent via-white to-transparent"></div>
        </div>
    </div>
);

const FeatureIcons = React.memo(() => (
    <div className="w-full py-12 border-b border-white/10 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
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
));

const CategoryCard = React.memo(({ title, icon: Icon, to, description }) => (
    <NavLink
        to={to}
        className="group relative flex flex-col items-center p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl transition-all duration-500 hover:bg-white/10 hover:border-(--medium-shade)/50 hover:-translate-y-2 overflow-hidden cursor-pointer"
    >
        <div className="absolute inset-0 bg-linear-to-br from-(--medium-shade)/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="w-16 h-16 mb-6 rounded-2xl bg-white/5 flex items-center justify-center text-(--medium-shade) transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-(--medium-shade)/10">
            <Icon size={32} />
        </div>
        <h3 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-(--medium-shade) transition-colors relative z-10">{title}</h3>
        <p className="text-sm text-white/50 text-center font-light mb-6 relative z-10">{description}</p>
        <div className="mt-auto flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-(--medium-shade) opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 relative z-10">
            Sprawdź <FiArrowRight />
        </div>
    </NavLink>
));

const ShopCategoriesSection = () => {
    const categories = [
        {
            title: "Kawy pod Filtr",
            icon: FiCoffee,
            to: "/shop?category=Ziarna&purpose=filtr",
            description: "Lekkie i owocowe ziarna idealne do metod przelewowych."
        },
        {
            title: "Kawy pod Espresso",
            icon: FiZap,
            to: "/shop?category=Ziarna&purpose=espresso",
            description: "Gęste i słodkie napary o głębokim charakterze."
        },
        {
            title: "Akcesoria",
            icon: FiSettings,
            to: "/shop?category=Zaparzacze",
            description: "Wszystko, czego potrzebujesz do zaparzenia idealnej kawy."
        },
        {
            title: "Herbaty & Matcha",
            icon: FaLeaf,
            to: "/shop?category=Herbaty",
            description: "Selekcja najwyższej jakości herbat i matchy specialty."
        },
        {
            title: "Ceramika",
            icon: FiPackage,
            to: "/shop?category=Kubki",
            description: "Ręcznie robione filiżanki i kubki od lokalnych artystów."
        }
    ];

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <span className="text-(--medium-shade) uppercase tracking-widest text-sm font-bold">Sklep Online</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-2">Nasze Kategorie</h2>
                <div className="w-24 h-1 bg-(--medium-shade) mx-auto mt-6 rounded-full opacity-60"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {categories.map((cat, idx) => (
                    <CategoryCard key={idx} {...cat} />
                ))}
            </div>
        </section>
    );
};

const QuestionField = React.memo(({ title, content, isOpen, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`
                group cursor-pointer rounded-2xl border transition-all duration-300 ease-out overflow-hidden
                ${isOpen
                    ? 'bg-black/40 border-(--medium-shade)/50 shadow-[0_0_20px_rgba(0,0,0,0.2)]'
                    : 'bg-black/20 border-white/25 hover:bg-black/50 hover:border-white/10 opacity-80'
                }
            `}
        >
            <div className='flex justify-between items-center p-6'>
                <h3 className={`font-serif text-lg md:text-xl transition-colors ${isOpen ? 'text-(--medium-shade) brightness-110' : 'text-white/80 brightness-95'}`}>
                    {title}
                </h3>
                <span className={`text-sm transition-transform duration-300 ${isOpen ? 'rotate-180 text-(--medium-shade)' : 'text-white/50'}`}>
                    {isOpen ? <FaMinus /> : <FaPlus />}
                </span>
            </div>

            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className='p-6 pt-0 text-base md:text-lg leading-relaxed text-white/60 border-t border-white/5 mt-2 font-light'>
                    {content}
                </div>
            </div>
        </div>
    )
});

const FAQSection = React.memo(() => {
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
        <div className='flex justify-center items-center flex-col px-4 py-24 relative overflow-hidden'>
            <div className="text-center mb-16 relative z-10">
                <span className="text-(--medium-shade) uppercase tracking-widest text-sm font-bold brightness-110">Wiedza & Info</span>
                <h2 className='font-serif font-bold text-4xl md:text-5xl mt-2 mb-4 text-white'>
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
});

export default function Home() {
    return (
        <main className="w-full min-h-screen">
            <HeroSection />
            <FeatureIcons />

            <div className="natural-bg">
                <ShopCategoriesSection />
            </div>


            <div className="relative">
                <FAQSection />
            </div>


            <div className="natural-bg border-t border-white/5">
                <BugReportSection />
            </div>
        </main>
    )
}