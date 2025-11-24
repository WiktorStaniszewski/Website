import 'styles/Shop.css'
import { useViewport } from 'src/components/hooks/useViewport'

function Products({filteredProducts}) {
  const { isMobile } = useViewport();
  return (
    <>
    {!isMobile ? 
      <section className="flex justify-around flex-wrap mt-8 z-[-2] min-h-screen">
        {filteredProducts}
      </section>
      :
      <section className="flex justify-around flex-wrap z-[-2] min-h-screen gap-4">
        {filteredProducts}
      </section>
      }
    </>
  )
}

export default Products
