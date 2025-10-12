import { useState } from "react";
import 'styles/Menu.css'
import Menu from './Menu';
import { classicMenuArray, summerMenuArray, specialMenuArray, teaMenuArray, subsArray} from './products';

function Menus() {
    const [menu, setMenus] = useState({
        classic: false,
        summer: false,
        special: false,
        tea: false,
        subs: false,
    });
    const toggleMenu = (menuName) => {
        setMenus(prev => ({
            ...prev,
            [menuName]: !prev[menuName],
        }))
    }
    return (
        <div className="menu-container1">
            <div className="menu-container2">
                <Menu 
                    displayedTitle="Klasyczne Menu" 
                    classTitle="classic" 
                    productArray={classicMenuArray} 
                    isActive={menu.classic} 
                    toggleMenu={toggleMenu} 
                />
                <Menu 
                    displayedTitle="Letnie Menu" 
                    classTitle="summer" 
                    productArray={summerMenuArray} 
                    isActive={menu.summer} 
                    toggleMenu={toggleMenu} 
                />
                <Menu 
                    displayedTitle="Special Menu" 
                    classTitle="special" 
                    productArray={specialMenuArray} 
                    isActive={menu.special} 
                    toggleMenu={toggleMenu} 
                />
                <Menu 
                    displayedTitle="Bezkofeinowe" 
                    classTitle="tea" 
                    productArray={teaMenuArray} 
                    isActive={menu.tea} 
                    toggleMenu={toggleMenu} 
                />
                <Menu 
                    displayedTitle="Dodatki / Zamienniki" 
                    classTitle="subs" 
                    productArray={subsArray} 
                    isActive={menu.subs} 
                    toggleMenu={toggleMenu} 
                />
            </div>
        </div>
    )
}

export default Menus