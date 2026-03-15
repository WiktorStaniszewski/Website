import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import Card from "./ProductCard";

export default function Products({ filters }) {
  const [visibleCount, setVisibleCount] = useState(30);

  useEffect(() => {
    setVisibleCount(30);
  }, [filters.filteredProducts]);

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

  const totalProducts = filters.filteredProducts.length;
  const visibleProducts = filters.filteredProducts.slice(0, visibleCount);
  const hasMore = totalProducts > visibleCount;

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

        {hasMore && (
            <div className="flex justify-center mt-12 w-full animate-in fade-in duration-500 relative z-10">
                <button 
                    onClick={() => setVisibleCount(prev => prev + 30)}
                    className="px-8 py-4 bg-(--medium-shade) hover:brightness-110 text-[#24201d] font-bold rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(143,120,93,0.2)] active:scale-95 cursor-pointer"
                >
                    Załaduj kolejne 30 (pozostało {totalProducts - visibleCount})
                </button>
            </div>
        )}
    </div>
  );
}