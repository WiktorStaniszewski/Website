import { useState } from 'react';
import 'styles/Home.css'
import { FaPlus, FaMinus } from "react-icons/fa";
import { NavLink } from 'react-router-dom';

function Home() {
    return (
    <div className='home'>
        <div className="image-wrap">
            <img src="../images/tlo1.jpg" alt="" />
            <div className="image-text">
                <h1>Body Espresso Bar</h1>
                <h3>Kawiarnia z segmentu Specialty Coffee Kreatywnie w temacie kawy! Zero napinki! tylko dobre szoty </h3>
                <NavLink to="menu" ><button className="btn-1">Zobacz Menu!</button></NavLink>
            </div>
        </div>

        <div className="sec4">
            <h1>Częste Pytania Klientów:</h1>
            <div className="sec4div">
                <QuestionField 
                    title="Co to jest Premium Shot?" 
                    content="Odkryj espresso w nieoczywistej odsłonie! Nasz PREMIUM SHOT to wyjątkowa selekcja ziaren z przeróżnych krajów, które zachwycają owocowym charakterem, przyjemną kwasowością oraz pełnią aromatu. Jest to espresso dla poszukiwaczy niespotykanych doznań smakowych. Jeśli lubisz kawę, która zaskakuje, to jest Twój wybór!" 
                />
                <QuestionField 
                    title="Pytanie2" 
                    content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione nisi hic odio impedit iusto voluptate laborum dolorem rerum libero eligendi, aspernatur, sapiente architecto debitis suscipit voluptatem! Alias expedita similique molestias." 
                />
                <QuestionField 
                    title="Pytanie3" 
                    content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione nisi hic odio impedit iusto voluptate laborum dolorem rerum libero eligendi, aspernatur, sapiente architecto debitis suscipit voluptatem! Alias expedita similique molestias." 
                />
                <QuestionField 
                    title="Pytanie3" 
                    content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione nisi hic odio impedit iusto voluptate laborum dolorem rerum libero eligendi, aspernatur, sapiente architecto debitis suscipit voluptatem! Alias expedita similique molestias." 
                />
            </div>
        </div>
    </div>
)}

function QuestionField({title, content}) {
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