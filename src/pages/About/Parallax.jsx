import React from 'react';

function PartnerCard({ name, url }) {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="cursor-pointer group">
            <div className="
                flex items-center justify-center flex-col 
                bg-white/5 backdrop-blur-sm border border-white/5 rounded-3xl
                p-4 transition-all duration-300 ease-out
                hover:bg-white/10 hover:border-(--medium-shade)/30 hover:-translate-y-2 hover:shadow-2xl
            ">
                <div className="overflow-hidden rounded-2xl w-48 h-48 relative">
                    <img
                        src={`images/Partners/${name.toLowerCase()}.jpg`}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                    {/* Overlay to blend image slightly with dark theme until hover */}
                    <div className="absolute inset-0 bg-[#24201d]/20 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>
                
                <div className="mt-4 mb-2">
                    <span className="text-(--font-color) text-sm font-bold tracking-widest uppercase opacity-60 group-hover:opacity-100 group-hover:text-(--medium-shade) transition-all">
                        {name}
                    </span>
                </div>
            </div>
        </a>
    )
}

export default function Parallax() {
    const partners = {
        "Kaizen":"https://kaizencoffee.pl/",
        "Roastains":"https://www.roastains.com/",
        "Runty":"https://www.runtyroaster.pl/",
        "Trigger":"https://triggerroastery.com/pl/",
        "SwiezoUpieczona":"https://swiezo-upieczona.com.pl/",
        "toCiekawa":"https://www.instagram.com/tociekawa_dluga_krakow/"
    }

    return (
        <div className="flex flex-wrap flex-row gap-6 justify-center">
            {Object.entries(partners).map(([name, url]) => (
                <PartnerCard key={name} name={name} url={url} />
            ))}
        </div>
    )
}