import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useViewport } from "components/hooks/useViewport.jsx";

function Menu({displayedTitle, classTitle, productArray, isActive, toggleMenu}) {

  const { isMobile } = useViewport();
    
    const listOfItems = isActive 
    ? productArray.map(item => 
            <> {isMobile ? 
                <>
                    <li key={item.name} className={'menu-item flex justify-between'}>
                        <h3 className="menu-name">{item.name}</h3>
                        <h3 className="menu-price">{item.price}</h3>   
                    </li>
                    <span className="menu-ingredients">{item.ingredients}</span> 
                </>
                :
                <li key={item.name} className={'menu-item grid grid-cols-3'}>
                    <h3 className="menu-name">{item.name}</h3>
                    <h3 className="menu-ingredients">{item.ingredients}</h3> 
                    <span className="menu-price">{item.price}</span>   
                </li>
                }
            </>
        ): null;

    return (
        <div onClick={() => toggleMenu(classTitle)} 
        className='
            w-full 
            py-3 
            px-[2em] 
            backdrop-blur-sm 
            backdrop-brightness-85 
            my-5 
            shadow-[3px_5px_7px_var(--darker-bg)] 
            transition-transform 
            ease-in-out 
            duration-100
            hover:backdrop-brightness-75 
            hover:cursor-pointer 
            hover:scale-x-[1.01] 
            hover:scale-y-[1.01]
            rounded-3xl
            lg:w-6/10
            min-h-24'
        >
            <div className="flex items-center justify-between text-base">
                <h1 className='text-xl font-bold'>{displayedTitle}:</h1>
                <button className="flex items-center justify-end overflow-hidden h-16 w-25 cursor-pointer text-3xl">
                    {isActive ? (<RiArrowDropUpLine />) : (<RiArrowDropDownLine />)}
                </button>
            </div>
            {isActive && <ul className={'menu-list'}>{listOfItems}</ul>}
        </div>
    )
}

export default Menu;
