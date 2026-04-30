import { FaSpinner } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Card from "./ProductCard";
import usePagination from "src/hooks/usePagination";
import { useMemo } from "react";

const PRODUCTS_PER_PAGE = 24;

export default function Products({ filters }) {
  const filterFingerprint = useMemo(() => 
    JSON.stringify([filters.category, filters.query, filters.company, filters.flavors, filters.purpose, filters.processing, filters.priceRange]),
    [filters.category, filters.query, filters.company, filters.flavors, filters.purpose, filters.processing, filters.priceRange]
  );

  const {
    visibleItems: visibleProducts,
    totalPages,
    currentPage: safePage,
    goToPage,
    getPageNumbers,
    startIndex,
    totalItems: totalProducts,
    itemsPerPage
  } = usePagination(filters.filteredProducts, { 
    itemsPerPage: PRODUCTS_PER_PAGE, 
    storageKey: 'shop_page',
    filterFingerprint 
  });

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
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-12 gap-2 animate-in fade-in duration-500">
          <button
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage <= 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-(--font-color) border border-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <FiChevronLeft />
          </button>

          {getPageNumbers().map((page, idx) => (
            page === '...' ? (
              <span key={`dots-${idx}`} className="w-8 text-center text-(--font-color)/40 text-sm select-none">…</span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all cursor-pointer ${page === safePage
                    ? 'bg-(--medium-shade) text-[#24201d] shadow-[0_0_15px_rgba(143,120,93,0.3)] scale-110'
                    : 'bg-white/5 hover:bg-white/15 text-(--font-color) border border-white/10'
                  }`}
              >
                {page}
              </button>
            )
          ))}

          <button
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage >= totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-(--font-color) border border-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <FiChevronRight />
          </button>

          <span className="ml-4 text-xs text-(--font-color)/40 font-bold">
            {startIndex + 1}–{Math.min(startIndex + PRODUCTS_PER_PAGE, totalProducts)} z {totalProducts}
          </span>
        </div>
      )}
    </div>
  );
}