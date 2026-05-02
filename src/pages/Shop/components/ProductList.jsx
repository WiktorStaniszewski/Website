import { FaSpinner } from "react-icons/fa";
import Card from "./ProductCard";
import usePagination from "src/hooks/usePagination";
import PaginationControls from "src/components/ui/PaginationControls";
import { useMemo } from "react";

const PRODUCTS_PER_PAGE = 24;

export default function Products({ filters }) {
  const filterFingerprint = useMemo(() => 
    JSON.stringify([filters.category, filters.query, filters.company, filters.flavors, filters.purpose, filters.processing, filters.priceRange]),
    [filters.category, filters.query, filters.company, filters.flavors, filters.purpose, filters.processing, filters.priceRange]
  );

  const pagination = usePagination(filters.filteredProducts, { 
    itemsPerPage: PRODUCTS_PER_PAGE, 
    storageKey: 'shop_page',
    filterFingerprint 
  });

  const { visibleItems: visibleProducts } = pagination;

  if (filters.loading) {
    return (
      <section className="flex justify-center items-center w-full min-h-[50vh]">
        <FaSpinner className="animate-spin text-4xl text-(--font-color)" />
      </section>
    );
  }

  if (filters.error) {
    return (
      <section className="flex justify-center items-center w-full min-h-[50vh]">
        <p className="text-red-400">{filters.error}</p>
      </section>
    )
  }

  return (
    <div className="flex flex-col w-full pb-20 relative z-10">
      <div className="mb-4">
        <PaginationControls pagination={pagination} scrollBehavior="none" />
      </div>
      
      <section className="flex flex-wrap lg:mt-8 min-h-[60vh] gap-4 ml-4 not-lg:justify-center relative z-10">
        {visibleProducts.length > 0 ? (
          visibleProducts.map((item, index) => (
            <Card key={item.id || index} product={item} />
          ))
        ) : (
          <div className="w-full flex justify-center items-center h-40">
            <p className="text-white/50 font-medium italic">Brak produktów spełniających kryteria.</p>
          </div>
        )}
      </section>

      {/* Paginacja */}
      <PaginationControls pagination={pagination} />
    </div>
  );
}