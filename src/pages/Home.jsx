import { useState } from 'react';
import '../styles/Home.css'
import { FaPlus, FaMinus } from "react-icons/fa";

function Home() {
    return (
    <div className='home'>
        <div className="image-wrap">
            <img src="../images/tlo1.jpg" alt="" />
            <div className="image-text">
                <h1>Body Espresso Bar</h1>
                <h3>Kawiarnia z segmentu Specialty Coffee Kreatywnie w temacie kawy! Zero napinki! tylko dobre szoty </h3>
                <button className="btn-1">Zobacz Menu!</button>
            </div>
        </div>

        <div className="sec4">
            <h1>Częste Pytania Klientów:</h1>
            <div className="sec4div">
                {QuestionField("Co to jest Premium Shot?", "Odkryj espresso w nieoczywistej odsłonie! Nasz PREMIUM SHOT to wyjątkowa selekcja ziaren z przeróżnych krajów, które zachwycają owocowym charakterem, przyjemną kwasowością oraz pełnią aromatu. Jest to espresso dla poszukiwaczy niespotykanych doznań smakowych. Jeśli lubisz kawę, która zaskakuje, to jest Twój wybór!")}
                {QuestionField("Pytanie2", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione nisi hic odio impedit iusto voluptate laborum dolorem rerum libero eligendi, aspernatur, sapiente architecto debitis suscipit voluptatem! Alias expedita similique molestias.")}
                {QuestionField("Pytanie3", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione nisi hic odio impedit iusto voluptate laborum dolorem rerum libero eligendi, aspernatur, sapiente architecto debitis suscipit voluptatem! Alias expedita similique molestias.")}
                {QuestionField("Pytanie4", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione nisi hic odio impedit iusto voluptate laborum dolorem rerum libero eligendi, aspernatur, sapiente architecto debitis suscipit voluptatem! Alias expedita similique molestias.")}
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
                            <input name="imie" type="text" placeholder="Imię" required className="home-input" />
                            <input name="nazwisko" type="text" placeholder="Nazwisko" required className="home-input" />
                            <input name="email" type="email" placeholder="Email" required className="home-input" />
                            <input name="opis_problemu" type="text" rows="4" placeholder="Opis problemu" required className="home-input" />
                            <button type="submit" className="btn-1">Submit Form</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
)}

function QuestionField(title, content) {
    const [activeQuestion, setActiveQuestion] = useState(false);
    const toggleQuestion = () => {
        setActiveQuestion((prev) => !prev);
    }
    return (
        <div onClick={toggleQuestion} className="qns">
            <div>
                <h4>{title}</h4>
                <p className={activeQuestion ? "content-active" : "content-active-not"}>{content}</p>
            </div>
            <button className="add">
                {activeQuestion ? <i><FaMinus /></i> : <i><FaPlus /></i>}
            </button>
        </div>
    )
}

export default Home