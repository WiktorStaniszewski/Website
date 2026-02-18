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
        <div className="relative min-h-screen pt-32 pb-20 px-4 lg:px-8 bg-(--80-shade) overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-(--medium-shade)/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-(--medium-shade)/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

            <div className="relative z-10 flex flex-col items-center justify-center gap-8 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="text-center">
                     <span className="text-(--medium-shade) uppercase tracking-[0.3em] text-xs font-bold brightness-110">Nasza Oferta</span>
                     <h2 className="font-serif font-bold text-4xl md:text-5xl mt-3 text-white">Menu</h2>
                </div>

                {menuItems.map((item, index) => (
                    <Menu 
                        key={item.key}
                        index={index}
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