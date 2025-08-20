import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

function MappingHelper(displayedTitle, classTitle, productArray, activeMenu, toggleMenu) {
    
    const listOfItems = productArray.map((item) => 
        <li key={item.name} className="menu-item">
            <span className="menu-name">{item.name}</span>
            <span className="menu-price">{item.price}</span>
        </li>)
    return (
        <div onClick={() => toggleMenu(classTitle)} className={classTitle+"-menu"}>
            <div className="item-header">
                <h2>{displayedTitle}:</h2>
                <button>
                    {activeMenu === classTitle ? (
                        <RiArrowDropUpLine />
                    ) : (
                        <RiArrowDropDownLine />
                    )}
                </button>
            </div>
            <ul className={activeMenu === classTitle ? classTitle+ 'menu-list menu-active' : classTitle + 'menu-list'}>{listOfItems}</ul>
        </div>
    )
}

export default MappingHelper;
