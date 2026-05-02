import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * PaginationControls Component
 * @param {Object} pagination - The object returned by usePagination hook
 */
export default function PaginationControls({ pagination, scrollBehavior = 'smooth' }) {
    const { currentPage, totalPages, goToPage, getPageNumbers, startIndex, totalItems, itemsPerPage } = pagination;
    
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center mt-8 gap-2">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    const prevPage = Number(currentPage) - 1;
                    goToPage(prevPage, scrollBehavior);
                }}
                disabled={Number(currentPage) <= 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
                <FiChevronLeft />
            </button>

            {getPageNumbers().map((page, idx) => (
                page === '...' ? (
                    <span key={`dots-${idx}`} className="w-8 text-center text-white/40 text-sm select-none">…</span>
                ) : (
                    <button
                        key={page}
                        onClick={(e) => {
                            e.stopPropagation();
                            goToPage(Number(page), scrollBehavior);
                        }}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all cursor-pointer ${Number(page) === Number(currentPage)
                            ? 'bg-(--medium-shade) text-[#24201d] shadow-[0_0_15px_rgba(143,120,93,0.3)] scale-110'
                            : 'bg-white/5 hover:bg-white/15 text-white border border-white/10'
                        }`}
                    >
                        {page}
                    </button>
                )
            ))}

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    const nextPage = Number(currentPage) + 1;
                    goToPage(nextPage, scrollBehavior);
                }}
                disabled={Number(currentPage) >= totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
                <FiChevronRight />
            </button>

            <span className="ml-4 text-xs text-white/40 font-bold hidden sm:inline">
                {startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalItems)} z {totalItems}
            </span>
        </div>
    );
}
