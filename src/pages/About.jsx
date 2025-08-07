import '../styles/About.css'
function About() {
    return (
        <div>
            <div className="sec-2">
                    <div>
                        <img src="images/BodyLogo.jpg" alt="cup" className="hidden" />
                    </div>
                    <div>
                        <h1>O nas</h1>
                        <p>Body Espresso Bar to wyjątkowa kawiarnia specialty coffee, 
                            która powstała z miłości do doskonałej kawy i niezobowiązującej 
                            atmosfery. Znajdujemy się w sercu Krakowa, na Dolnych Młynów 3/1, 
                            w miejscu, które łączy nowoczesność z industrialnym klimatem.
                        </p>
                        <div>{/*
                            <button onclick="window.open('https\://www.instagram.com/body.espressobar/', '_blank')" className="btn-1">Instagram</button>
                            <button onclick="window.open('https\://europeancoffeetrip.com/cafe/bodyespressobar-krakow/', '_blank')" className="btn-1">European Coffee Trip</button>
                            <button onclick="window.open('https\://www.google.pl/maps/place/Body+Espresso+Bar/@50.0639297,19.9253087,17z/data=!3m2!4b1!5s0x47165b0977f6ced9:0x1e9d024cb1297630!4m6!3m5!1s0x47165b35ad552877:0xe80ec041b165b4b6!8m2!3d50.0639263!4d19.927889!16s%2Fg%2F11fwnq6lb4?entry=ttu&g_ep=EgoyMDI1MDIyMy4xIKXMDSoASAFQAw%3D%3D', '_blank')" className="btn-1">Google Maps</button>
                            // */}
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