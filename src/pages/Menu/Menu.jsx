import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useViewport } from "components/hooks/useViewport.jsx";

function Menu({displayedTitle, classTitle, productArray, isActive, toggleMenu}) {
    
  const { isMobile } = useViewport();
    
    const listOfItems = isActive 
    ? productArray.map(item => 
            <> {isMobile ? 
                <>
                    <li key={item.name} className={'menu-item-mobile'}>
                        <span className="menu-name">{item.name}</span>
                        <span className="menu-price">{item.price}</span>   
                    </li>
                    <span className="menu-ingredients">{item.ingredients}</span> 
                </>
                :
                <li key={item.name} className={'menu-item'}>
                    <span className="menu-name">{item.name}</span>
                    <span className="menu-ingredients">{item.ingredients}</span> 
                    <span className="menu-price">{item.price}</span>   
                </li>
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
