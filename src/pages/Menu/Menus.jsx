import 'styles/Menu.css'
import Menu from './Menu';
import { useMenus } from 'hooks/Menu/useMenus';
import { 
    classicMenuArray, 
    summerMenuArray, 
    specialMenuArray, 
    teaMenuArray, 
    subsArray
} from './Products';

function Menus() {
    const { menu, toggleMenu } = useMenus({
        classic: true,
        summer: true,
        special: true,
        tea: true,
        subs: true,
    });

    const menuItems = [
        { title: "Klasyczne Menu", key: "classic", data: classicMenuArray },
        { title: "Letnie Menu", key: "summer", data: summerMenuArray },
        { title: "Special Menu", key: "special", data: specialMenuArray },
        { title: "Bezkofeinowe", key: "tea", data: teaMenuArray },
        { title: "Dodatki / Zamienniki", key: "subs", data: subsArray },
    ];

    return (
        <div className="flex flex-col p-4 lg:p-8 min-h-screen pt-24">
            <div className="flex flex-col items-center justify-center gap-6 w-full">
                {menuItems.map((item, index) => (
                    <Menu 
                        key={item.key}
                        index={index} // Pass index for alternating styling
                        displayedTitle={item.title} 
                        classTitle={item.key} 
                        productArray={item.data} 
                        isActive={menu[item.key]} 
                        toggleMenu={toggleMenu} 
                    />
                ))}
            </div>
        </div>
    )
}

export default Menus;