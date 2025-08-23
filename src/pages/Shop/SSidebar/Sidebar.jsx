import 'styles/Shop.css';
import { BsShop } from "react-icons/bs";
import Category from './Category/Category.jsx';
import Price from './Price/Price.jsx';
import Flavors from './Flavors/Flavors.jsx'
import Cafe from './SCafe/Cafe.jsx';

function Sidebar() {
  return (
    <div>
      <section className="shopSidebar">
        <div className="logo-container">
            <h1><BsShop className='react-icons'/></h1>
        </div>
        <Category />
        <Price />
        <Flavors />
        <Cafe />
      </section>
    </div>
  )
}

export default Sidebar
