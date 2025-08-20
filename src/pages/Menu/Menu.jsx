import { useState } from "react";
import '../../styles/Menu.css'
import MappingHelper from './MappingHelper';
import { classicMenuArray, summerMenuArray, specialMenuArray, teaMenuArray, subsArray} from './products';

function Menu() {
    const [activeMenu, setActiveMenu] = useState(null);
    const toggleMenu = (menuName) => {
        setActiveMenu(prev => (prev === menuName ? null : menuName));
    }
    return (
        <div className="menu-container1">
            <div className="menu-container2">
                {MappingHelper("Klasyczne Menu", "classic", classicMenuArray, activeMenu, toggleMenu)}
                {MappingHelper("Letnie Menu", "summer", summerMenuArray, activeMenu, toggleMenu)}
                {MappingHelper("Special Menu", "special", specialMenuArray, activeMenu, toggleMenu)}
                {MappingHelper("Bezkofeinowe", "tea", teaMenuArray, activeMenu, toggleMenu)}
                {MappingHelper("Dodatki / Zamienniki:", "subs", subsArray, activeMenu, toggleMenu)}
            </div>
        </div>
    )
}

export default Menu