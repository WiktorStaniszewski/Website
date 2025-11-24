import { useState } from 'react'
import { useViewport } from 'src/components/hooks/useViewport';

import Parallax from 'src/pages/About/Parallax';

function About() {
    const [ isHovered, setIsHovered ] = useState(false);
    const { isMobile } = useViewport();
    return (
        <>
            <section className="flex justify-center flex-col w-screen">
                <div className='min-h-[60vh] flex flex-col items-center justify-center text-center gap-8'>
                    <h1 className='text-5xl font-bold'>Somnium Cafe Bar</h1>
                    <p className='w-7/10'>
                        Wyjątkowa kawiarnia specialty coffee, która powstała z miłości do doskonałej kawy i niezobowiązującej atmosfery. Znajdujemy się w sercu Krakowa, na Dolnych Młynów 3/1, w miejscu, które łączy nowoczesność z industrialnym klimatem.
                    </p>
                </div>
            </section>
            <section className="flex justify-center items-center w-screen flex-col lg:py-10 backdrop-brightness-85">
                <div className='flex justify-center items-center w-screen lg:w-6/10 lg:min-h-8/10 flex-col'
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}>
                    <img src="images/Somnium/Somnium-Wide.jpg" alt="cup" className={`lg:rounded-3xl transition-all duration-300 ease-in-out ${isHovered ? 'lg:blur-sm' : ''}`} 
                    />
                    <div className={`lg:absolute w-5/10 items-center justify-center flex-col text-center text-(--font-color) transition-all duration-300 gap-8 ease-in-out flex my-12 lg:my-12 ${isHovered ? 'lg:flex' : 'lg:hidden'}`}
                    >
                        <h1 className='text-5xl font-bold'>Somnium</h1>
                        <p>Nasza nazwa - "Somnium" - nawiązuje do jednego z kluczowych aspektów 
                            kawy: jej struktury, pełni i bogactwa smaku. To właśnie te cechy 
                            staramy się wydobyć w każdej filiżance espresso, którą serwujemy. 
                            Wierzymy, że kawa powinna być nie tylko napojem, ale także doświadczeniem, 
                            które angażuje wszystkie zmysły.
                        </p>
                    </div>
                </div>
            </section>  
            {!isMobile ? 
            <>
                <section className="flex justify-center items-center w-screen flex-col">
                    <div className='min-h-[60vh] flex items-center justify-center flex-col w-7/10 text-center gap-8'>
                        <h1 className='text-5xl font-bold'>Wyjątkowość naszej kawiarni</h1>
                        <p>Specjalizujemy się w starannie dobranych ziarnach, pochodzących
                            z najlepszych palarni. Stawiamy na kreatywne podejście do kawy -
                            eksperymentujemy z metodami parzenia i proporcjami, aby każda
                            wizyta w Body Espresso Bar była unikalna. Nie znajdziesz u nas
                            zbędnego nadęcia ani przypadkowych napojów - tylko dobrze
                            przygotowane espresso, cappuccino czy alternatywne metody parzenia,
                            które pozwalają wydobyć pełnię smaku.
                        </p>
                    </div>
                </section>
                <div className='flex justify-center items-center w-screen flex-col py-10 h-8/10 backdrop-brightness-85'>
                    <img src="images/coffeebeans.jpg" alt="" className='lg:rounded-3xl w-6/10'/>
                </div>
            </>
            : 
            <>
                <div className='flex justify-center items-center w-screen flex-col mb-10 pt-10 h-8/10 backdrop-brightness-85'>
                    <img src="images/coffeebeans.jpg" alt="" className='lg:rounded-3xl'/>
                </div>
                <section className="flex justify-center items-center w-screen flex-col">
                    <div className='min-h-[60vh] flex items-center justify-center flex-col w-7/10 text-center gap-8'>
                        <h1 className='text-5xl font-bold'>Wyjątkowość naszej kawiarni</h1>
                        <p>Specjalizujemy się w starannie dobranych ziarnach, pochodzących
                            z najlepszych palarni. Stawiamy na kreatywne podejście do kawy -
                            eksperymentujemy z metodami parzenia i proporcjami, aby każda
                            wizyta w Body Espresso Bar była unikalna. Nie znajdziesz u nas
                            zbędnego nadęcia ani przypadkowych napojów - tylko dobrze
                            przygotowane espresso, cappuccino czy alternatywne metody parzenia,
                            które pozwalają wydobyć pełnię smaku.
                        </p>
                    </div>
                </section>
            </>}
            <section className='w-screen flex justify-center items-center flex-col py-10 mt-10 min-h-[60vh] not-lg:backdrop-brightness-85'>
                <h1 className='text-5xl font-bold pb-10'>Nasi Partnerzy</h1>
                <Parallax />
            </section>
        </>
    )
}

export default About