import '../styles/Home.css'

function Home() {
    return (
    <div className='home'>
        <div className="image-wrap">
            <img src="../images/tlo1.jpg" alt="" />
            <div className="image-text">
                <h1>Body Espresso Bar</h1>
                <h3>Kawiarnia z segmentu Specialty Coffee Kreatywnie w temacie kawy! Zero napinki! tylko dobre szoty </h3>
                <button id="poznajNas" className="btn-1">Zobacz Menu!</button>
            </div>
        </div>

        <div className="sec-4">
            <div className="sec4">
                <h1>Częste Pytania Klientów:</h1>
                <div className="sec4div">
                    <div className="qns">
                        <div>
                            <h4>Co to jest Premium Shot?</h4>
                            <p className="hide">
                                Odkryj espresso w nieoczywistej odsłonie! Nasz PREMIUM SHOT to wyjątkowa selekcja ziaren z przeróżnych krajów, które zachwycają owocowym charakterem, przyjemną kwasowością oraz pełnią aromatu. Jest to espresso dla poszukiwaczy niespotykanych doznań smakowych. Jeśli lubisz kawę, która zaskakuje, to jest Twój wybór!</p>
                        </div>
                        <div className="add">
                            <i className="fa-sharp fa-solid fa-plus"> </i>
                            <i className="fa-sharp fa-solid fa-minus hide"> </i>
                        </div>
                    </div>
                    <div className="qns">
                        <div>
                            <h4>Pytanie2</h4>
                            <p className="hide">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione nisi hic odio impedit iusto voluptate laborum dolorem rerum libero eligendi, aspernatur, sapiente architecto debitis suscipit voluptatem! Alias expedita similique molestias.</p>
                        </div>
                        <div className="add">
                            <i className="fa-sharp fa-solid fa-plus"> </i>
                            <i className="fa-sharp fa-solid fa-minus hide"> </i>
                        </div>
                    </div>
                    <div className="qns">
                        <div>
                            <h4>Pytanie3</h4>
                            <p className="hide">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione nisi hic odio impedit iusto voluptate laborum dolorem rerum libero eligendi, aspernatur, sapiente architecto debitis suscipit voluptatem! Alias expedita similique molestias.</p>
                        </div>
                        <div className="add">
                            <i className="fa-sharp fa-solid fa-plus"> </i>
                            <i className="fa-sharp fa-solid fa-minus hide"> </i>
                        </div>
                    </div>
                    <div className="qns">
                        <div>
                            <h4>Pytanie4</h4>
                            <p className="hide">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione nisi hic odio impedit iusto voluptate laborum dolorem rerum libero eligendi, aspernatur, sapiente architecto debitis suscipit voluptatem! Alias expedita similique molestias.</p>
                        </div>
                        <div className="add">
                            <i className="fa-sharp fa-solid fa-plus"> </i>
                            <i className="fa-sharp fa-solid fa-minus hide"> </i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="sec-5" id="sec5">
            <div className="sec5">
                <h1 className="hidden">
                    KONTAKT
                </h1>
                <div className="container">
                    <div className="hidden">
                        <h3>EMAIL:</h3>
                        <p>@gmail.com</p>   
                        <h3>TELEFON:</h3>
                        <p><a href="tel:+480123456789">0123456789</a></p>
                        <h3>ADRES:</h3>
                        <p><a target="_blank" href="https://www.google.pl/maps/place/Body+Espresso+Bar/@50.0639297,19.9253087,17z/data=!3m2!4b1!5s0x47165b0977f6ced9:0x1e9d024cb1297630!4m6!3m5!1s0x47165b35ad552877:0xe80ec041b165b4b6!8m2!3d50.0639263!4d19.927889!16s%2Fg%2F11fwnq6lb4?entry=ttu&g_ep=EgoyMDI1MDIyMy4xIKXMDSoASAFQAw%3D%3D', '_blank">ul, Dolnych Młynów 3/1, 31-124 Kraków</a>
                        </p>
                    </div>
                    <div>
                        <form method="post">
                            <input name="imie" type="text" placeholder="Imię" required className="hidden" />
                            <input name="nazwisko" type="text" placeholder="Nazwisko" required className="hidden" />
                            <input name="email" type="email" placeholder="Email" required className="hidden" />
                            <input name="opis_problemu" type="text" rows="4" placeholder="Opis problemu" required className="hidden" />
                            <button type="submit" className="btn-1">Submit Form</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
)}

export default Home