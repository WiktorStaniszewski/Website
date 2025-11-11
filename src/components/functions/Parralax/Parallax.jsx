function PartnerCard({ name, url }) {

    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
            <div className="flex items-center justify-center flex-col hover:scale-105 hover:brightness-90 transition-all duration-300 ease-in-out">
                <img
                    src={`/images/Partners/${name.toLowerCase()}.jpg`}
                    alt={name}
                    className="w-50 h-50 object-cover mb-6 shadow-lg rounded-3xl"
                />
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
        <div className="flex flex-wrap flex-row gap-8 justify-center">
            {Object.entries(partners).map(([name, url]) => (
                <PartnerCard key={name} name={name} url={url} />
            ))}
        </div>
    )
}
