import 'styles/Menu.css'
import Menu from './Menu';
import { useMenus } from 'hooks/Menu/useMenus';
import { 
    classicMenuArray, 
    summerMenuArray, 
    specialMenuArray, 
    teaMenuArray, 
    subsArray
} from './products';

function Menus() {
    const { menu, toggleMenu } = useMenus({
        classic: false,
        summer: false,
        special: false,
        tea: false,
        subs: false,
    });
    return (
        <div className="flex flex-col p-8 min-h-screen">
            <div className="flex items-center flex-col justify-center flex-wrap menuContainer">
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