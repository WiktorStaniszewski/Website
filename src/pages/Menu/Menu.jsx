import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useState, useEffect } from "react";

function Menu({displayedTitle, classTitle, productArray, isActive, toggleMenu}) {
    
    const [width, setWidth] = useState(window.innerWidth)
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth)
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize)
    },[]);
    
    const listOfItems = isActive 
    ? productArray.map(item => 
            <> {width > 1000 ? 
                <li key={item.name} className={'menu-item'}>
                    <span className="menu-name">{item.name}</span>
                    <span className="menu-ingredients">{item.ingredients}</span> 
                    <span className="menu-price">{item.price}</span>   
                </li>
                :
                <>
                    <li key={item.name} className={'menu-item-mobile'}>
                        <span className="menu-name">{item.name}</span>
                        <span className="menu-price">{item.price}</span>   
                    </li>
                    <span className="menu-ingredients">{item.ingredients}</span> 
                </>
                }
            </>
        ): null;

    return (
        <div onClick={() => toggleMenu(classTitle)} className={classTitle+"-menu"}>
            <div className="item-header">
                <h2>{displayedTitle}:</h2>
                <button className="qnsButton">
                    {isActive ? (<RiArrowDropUpLine />) : (<RiArrowDropDownLine />)}
                </button>
            </div>
            {isActive && <ul className={'menu-list'}>{listOfItems}</ul>}
        </div>
    )
}

export default Menu;
