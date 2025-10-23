import 'styles/Shop.css'
import { useViewport } from 'src/components/hooks/useViewport'

function Products({filteredProducts}) {
  const { isMobile } = useViewport();
  return (
    <>
    {!isMobile ? 
      <section className="flex flex-wrap mt-8 z-[-2] min-h-screen">
        {filteredProducts}
      </section>
      :
      <section className="flex justify-center flex-wrap z-[-2] min-h-screen">
        {filteredProducts}
      </section>
      }
    </>
  )
}

export default Products
