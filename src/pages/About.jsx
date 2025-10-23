import 'styles/About.css'
function About() {
    return (
        <div className='general-sec'>
            <div className="sec-2">
                <div className='first-image'>
                    <img src="images/BodyLogo.jpg" alt="cup" className="hidden" />
                </div>
                <div className='text-area'>
                    <h1>O nas</h1>
                    <p>Body Espresso Bar to wyjątkowa kawiarnia specialty coffee, 
                        która powstała z miłości do doskonałej kawy i niezobowiązującej 
                        atmosfery. Znajdujemy się w sercu Krakowa, na Dolnych Młynów 3/1, 
                        w miejscu, które łączy nowoczesność z industrialnym klimatem.
                    </p>
                    <div>
                    </div>
                </div>
            </div>  
            <div className="sec-2-2">
                <div>
                    <h1>Czemu Body?</h1>
                    <p>Nasza nazwa - "Body" - nawiązuje do jednego z kluczowych aspektów 
                        kawy: jej struktury, pełni i bogactwa smaku. To właśnie te cechy 
                        staramy się wydobyć w każdej filiżance espresso, którą serwujemy. 
                        Wierzymy, że kawa powinna być nie tylko napojem, ale także doświadczeniem, 
                        które angażuje wszystkie zmysły.
                    </p>
                </div>
                <div>
                    <img src="images/prototype.jpg" alt="" />
                </div>
            </div>  
            <div className="sec-2-3">
                <div>
                    <h1>Wyjątkowość naszej kawiarni</h1>
                    <p>Specjalizujemy się w starannie dobranych ziarnach, pochodzących 
                        z najlepszych palarni. Stawiamy na kreatywne podejście do kawy - 
                        eksperymentujemy z metodami parzenia i proporcjami, aby każda 
                        wizyta w Body Espresso Bar była unikalna. Nie znajdziesz u nas 
                        zbędnego nadęcia ani przypadkowych napojów - tylko dobrze 
                        przygotowane espresso, cappuccino czy alternatywne metody parzenia, 
                        które pozwalają wydobyć pełnię smaku.
                    </p>
                </div>
                <div>
                    <img src="images/coffeebeans.jpg" alt="" />
                </div>
            </div>
            
            <div className="sec-3 hidden">
                <div className="sec3">
                    <h1>Nasi Partnerzy</h1>
                    <div className="container">
                        <div>
                            <img src="/images/roastains.jpg" alt="" />
                            <h4>Roastains</h4>
                        </div>
                        <div>
                            <img src="/images/runty.png" alt="" />
                            <h4>Runty Roasters</h4>
                        </div>
                        <div>
                            <img src="/images/trigger.png" alt="" />
                            <h4>Trigger Roastery</h4>
                        </div>
                        <div>
                            <img src="/images/kaizen.png" alt="" />
                            <h4>Kaizen</h4>
                        </div>
                        <div>
                            <img src="/images/swiezoupieczona.jpeg" alt="" />
                            <h4>Świeżo Upieczona</h4>
                        </div>
                        <div>
                            <img src="/images/tociekawa.jpg" alt="" />
                            <h4>Tociekawa - Specialty coffee</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About