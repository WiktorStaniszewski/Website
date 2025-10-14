import 'styles/Shop.css'
import { useViewport } from 'src/components/hooks/useViewport'

function Products({filteredProducts}) {
  const { isMobile } = useViewport();
  return (
    <>
    {!isMobile ? 
      <section className="card-container">
        {filteredProducts}
      </section>
      :
      <section className="card-container-mobile">
        {filteredProducts}
      </section>
      }
    </>
  )
}

export default Products
