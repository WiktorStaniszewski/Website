import React from 'react'
import Form from 'components/ui/Form';
import { FaCoffee, FaStar, FaUserFriends, FaRegCheckCircle } from 'react-icons/fa';

export default function Recruitment() {
  return (
    <div className='min-h-screen pt-32 pb-20 px-4 md:px-8 flex flex-col items-center relative overflow-hidden'>
       {/* Background Ambience */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-(--medium-shade)/10 rounded-full blur-[120px] pointer-events-none"></div>

       <section className='max-w-4xl w-full animate-in fade-in slide-in-from-bottom-8 duration-700'>
          {/* Header Card */}
          <div className='bg-[#24201d]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl mb-12 relative overflow-hidden'>
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-(--medium-shade) to-transparent opacity-50"></div>
            
            <div className="text-center mb-10">
                <span className="text-(--medium-shade) uppercase tracking-[0.3em] text-xs font-bold">Kariera</span>
                <h1 className='font-serif font-bold text-4xl md:text-5xl mt-3 mb-6 text-(--font-color)'>
                  Dołącz do <span className="italic text-white/90">Somnium</span>
                </h1>
                <p className='text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed'>
                  Jesteśmy kawiarnią specialty z Krakowa i poszukujemy kawowych bohaterów! 
                  Tworzymy miejsce, gdzie pasja do kawy spotyka się z doskonałą obsługą.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-(--font-color)/90">
                <div className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 border-b border-white/10 pb-2">
                        <FaUserFriends className="text-(--medium-shade)"/> Kogo szukamy?
                    </h3>
                    <ul className="space-y-4">
                        {[
                            "Osób profesjonalnych, pracujących z uśmiechem",
                            "Miłośników kawy (zarówno parzenia, jak i picia!)",
                            "Osób z wysoką kulturą osobistą",
                            "Graczy zespołowych ceniących komunikację"
                        ].map((item, i) => (
                            <li key={i} className="flex gap-3 text-sm md:text-base leading-relaxed">
                                <FaRegCheckCircle className="mt-1 text-(--medium-shade) shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 border-b border-white/10 pb-2">
                        <FaStar className="text-(--medium-shade)"/> Co oferujemy?
                    </h3>
                    <ul className="space-y-4">
                        {[
                            "Szkolenia sensoryczne i techniczne (Latte Art, Espresso)",
                            "Pracę na sprzęcie najwyższej klasy",
                            "Wewnętrzne cuppingi i rozwój wiedzy",
                            "Elastyczny grafik (pełny etat lub weekendy)"
                        ].map((item, i) => (
                            <li key={i} className="flex gap-3 text-sm md:text-base leading-relaxed">
                                <FaCoffee className="mt-1 text-(--medium-shade) shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-10 p-6 bg-(--medium-shade)/10 border border-(--medium-shade)/20 rounded-2xl text-center">
                <h3 className='text-lg font-bold text-(--medium-shade) mb-2'>Ważna informacja</h3>
                <p className="text-sm md:text-base opacity-90">
                   Nie szukamy osób na sezon. Wychodzimy z założenia, że to ludzie tworzą kawiarnie. 
                   Jeśli chcesz zostać z nami na dłużej i rozwijać swoje umiejętności – wypełnij formularz poniżej.
                </p>
            </div>
          </div> 
          
          {/* Application Form Component */}
          <Form />
      </section>
    </div>
  )
}