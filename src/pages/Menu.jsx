import { useState } from 'react';
import '../styles/Menu.css'
import { RiArrowDropDownLine } from "react-icons/ri";

function Menu() {
    const [activeMenu, setActiveMenu] = useState(null);
    const toggleMenu = (menuName) => {
        setActiveMenu(prev => (prev === menuName ? null : menuName));
    }

    const classicMenuArray = [
        {name: 'Shot (House)', price: '12'},
        {name: 'Shot (Premium)', price: '16*'},
        {name: 'Americano', price: '15'},
        {name: 'Flat White', price: '17'},
        {name: 'Cappuccino', price:'17/19'},
        {name: 'Latte', price:'19'},
        {name: 'Przelew', price: '12'},
        {name: 'Manual Brew', price: '20'},
        {name: 'Hot Chocolate', price: '18'},
        {name: 'Hojicha Flat', price: '17'},
        {name: 'Matcha Latte', price: '19'}
    ]
    const classicMenuItems = classicMenuArray.map((item) => 
                    <li key={item.name} className="menu-item">
                        <span className="menu-name">{item.name}</span>
                        <span className="menu-price">{item.price}</span>
                    </li>)
    const summerMenuArray = [
        {name: 'Iced Latte', price: '20'},
        {name: 'Orangino', price: '22'},
        {name: 'Espresso Tonic', price: '23'},
        {name: 'Cold Brew', price: '22'},
        {name: 'Przelew na Lodzie', price: '18'},
        {name: 'Kalita', price: '23'},
        {name: 'Iced Matcha Latte', price: '20'},
        {name: 'Iced Matcha Tonic', price: '21'},
        {name: 'Iced Matcha Orange', price: '23'},
        {name: 'Iced Drip', price: '*'}
    ]
    const summerMenuItems = summerMenuArray.map((item) => 
                    <li key={item.name} className="menu-item">
                        <span className="menu-name">{item.name}</span>
                        <span className="menu-price">{item.price}</span>
                    </li>)
    const specialMenuArray = [
        {name: 'Zielone Jabłko', price: '23'},
        {name: 'Green Coconut Drift', price: '26'},
        {name: 'Spiced Hojicha Chill', price: '24'},
        {name: 'Lavender Whisper', price: '25'},
        {name: 'Cascara Tonic', price: '20'}
    ]
    const specialMenuItems = specialMenuArray.map((item) => 
                    <li key={item.name} className="menu-item">
                        <span className="menu-name">{item.name}</span>
                        <span className="menu-price">{item.price}</span>
                    </li>)
    const teaMenuArray = [
        {name: 'Herbata Czarna', price: '16'},
        {name: 'Herbata Zielona', price: '16'},
        {name: 'Herbata Niebieska', price: '16'},
        {name: 'Herbata Owocowa', price: '16'},
        {name: 'Sok', price: '18'},
        {name: 'Lemoniada', price: '18'}
    ]
    const teaMenuItems = teaMenuArray.map((item) => 
                    <li key={item.name} className="menu-item">
                        <span className="menu-name">{item.name}</span>
                        <span className="menu-price">{item.price}</span>
                    </li>)
    const additionsArray = [
        {name: 'Mleko Roślinne', price: '+2'},
        {name: '+Shot House', price: '+4'},
        {name: '+Shot Premium', price: '+5'}
    ]
    const additionsItems = additionsArray.map((item) => 
                    <li key={item.name} className="menu-item">
                        <span className="menu-name">{item.name}</span>
                        <span className="menu-price">{item.price}</span>
                    </li>)

    return (
        <div className="menu-container1">
            <div className="menu-container2">
                <div className="classic-menu">
                    <div className="item-header">
                        <h2>Klasyczne Menu:</h2>
                        <button onClick={() => toggleMenu('classic')}><RiArrowDropDownLine /></button>
                    </div>
                    <ul className={activeMenu === 'classic' ? 'classic menu-list menu-active' : 'classic menu-list'}>{classicMenuItems}</ul>
                </div>
                <div className="summer-menu">
                    <div className="item-header">
                        <h2>Letnie Menu:</h2>
                        <button onClick={() => toggleMenu('summer')}><RiArrowDropDownLine /></button>
                    </div>
                    <ul className={activeMenu === 'summer' ? 'summer menu-list menu-active' : 'summer menu-list'}>{summerMenuItems}</ul>
                </div>
                <div className="special-menu">
                    <div className="item-header">
                        <h2>Special Menu:</h2>
                        <button onClick={() => toggleMenu('special')}><RiArrowDropDownLine /></button>
                    </div>
                    <ul className={activeMenu === 'special' ? 'special menu-list menu-active' : 'special menu-list'}>{specialMenuItems}</ul>
                </div>
                <div className="tea-menu">
                    <div className="item-header">
                        <h2>Bezkofeinowe:</h2>
                        <button onClick={() => toggleMenu('tea')}><RiArrowDropDownLine /></button>
                    </div>
                    <ul className={activeMenu === 'tea' ? 'tea menu-list menu-active' : 'tea menu-list'}>{teaMenuItems}</ul>
                </div>
                <div className="addition-menu">
                    <div className="item-header">
                        <h2>Dodatki / Zamienniki:</h2>
                        <button onClick={() => toggleMenu('subs')}><RiArrowDropDownLine /></button>
                    </div>
                    <ul className={activeMenu === 'subs' ? 'subs menu-list menu-active' : 'subs menu-list'}>{additionsItems}</ul>
                </div>
            </div>
        </div>
    )
}

export default Menu