import '../../styles/Shop.css'
import { AiFillStar } from 'react-icons/ai'
import { FaCartPlus } from "react-icons/fa";
import Card from '../SComponents/Card';
import products from '../Sdb/shopData';


function Products() {
    const allProducts = products.map((product) =>
      <div key={product.name}>{Card(product.name, product.price, product.image)}</div>
    )
  return (
    <>
      <section className="card-container">
        {allProducts}
      </section>
    </>
  )
}

export default Products
