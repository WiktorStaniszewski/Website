import { useToggle } from "@uidotdev/usehooks";
import { FaPlus, FaMinus } from "react-icons/fa";
import { NavLink } from 'react-router-dom';

function Home() {
    return (
    <>
        <div className='w-screen relative inline-block h-screen image-wrap' aria-label='Somnium Cafe Bar'>
            <img src="../images/tlo1.jpg" alt="" className='w-full h-full filter brightness-50 relative object-cover object-[50%] align-bottom lg:(object-center lg:h-11/12)' />
            <div className='flex absolute top-50 w-full flex-col items-center justify-center text-center px-4 text-(--font-color) text-xs gap-4'>
                <h1 className='flex text-5xl overflow-hidden font-semibold p-4'>Somnium Cafe Bar</h1>
                <h3 className='py-5 text-lg overflow-hidden text-center font-medium mb-'>Kawiarnia z segmentu Specialty Coffee Kreatywnie w temacie kawy! Zero napinki! tylko dobre szoty </h3>
                <NavLink style={{textDecoration: 'none'}} to="menu" ><button className='mainButton border border-solid-(--font-color)'>Zobacz Menu!</button></NavLink>
            </div>
        </div>

        <div className='flex justify-center items-center text-(--font-color) flex-col px-4 my-4'>
            <h2 className='font-semibold text-3xl'>Częste Pytania Klientów:</h2>
            <div className="flex flex-col gap-4 w-9/10 lg:w-6/10 py-4 transition-all duration-300 ease-in">
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
    </>
)}

function QuestionField({title, content}) {
    const [on, toggle] = useToggle(false);
    return (
        <div onClick={toggle} className='cursor-pointer backdrop-brightness-85 backdrop-blur-sm flex justify-between rounded-3xl mt-2 items-center py-8 px-8 transition-all duration-100 ease-in shadow-[1px_3px_10px_var(--header-footer-bg)] hover:scale-102 lg:hover:backdrop-brightness-75'>
            <div className='m-0 w-full'>
                <h3 className='font-semibold text-(--font-h3) flex flex-row justify-between items-center'>
                    {title}
                    <button className='flex items-start h-full'>
                        {on ? <i><FaMinus /></i> : <i><FaPlus /></i>}
                    </button>
                </h3>
                <p className={on ? 'flex mt-4 text-base' : 'hidden'}>{content}</p>
            </div>
        </div>
    )
}

export default Home