import { useState, useEffect, useMemo, useRef } from 'react';

/**
 * usePagination Hook
 * @param {Array} items - The full list of items to paginate
 * @param {Object} options - Configuration options
 * @param {number} options.itemsPerPage - Number of items per page (default: 10)
 * @param {string} options.storageKey - Key to store current page in sessionStorage (optional)
 * @param {any} options.filterFingerprint - Values that trigger a reset to page 1 (optional)
 */

export default function usePagination(items, { itemsPerPage = 10, storageKey = null, filterFingerprint = null } = {}) {
    const [currentPage, setCurrentPage] = useState(() => {
        if (storageKey) {
            const saved = sessionStorage.getItem(storageKey);
            return saved ? parseInt(saved, 10) : 1;
        }
        return 1;
    });

    const prevFingerprintRef = useRef(filterFingerprint);
    const isMounted = useRef(false);

    useEffect(() => {
        const currentFingerprintStr = JSON.stringify(filterFingerprint);
        const prevFingerprintStr = JSON.stringify(prevFingerprintRef.current);
        
        if (prevFingerprintStr !== currentFingerprintStr) {
            prevFingerprintRef.current = filterFingerprint;
            setCurrentPage(1);
            if (storageKey) sessionStorage.setItem(storageKey, '1');
        }
    }, [filterFingerprint, storageKey]);

    useEffect(() => {
        if (storageKey) {
            sessionStorage.setItem(storageKey, currentPage.toString());
        }
    }, [currentPage, storageKey]);

    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const safePage = Math.min(currentPage, totalPages);
    
    const startIndex = (safePage - 1) * itemsPerPage;
    const visibleItems = useMemo(() => 
        items.slice(startIndex, startIndex + itemsPerPage),
    [items, startIndex, itemsPerPage]);

    const goToPage = (page, scrollBehavior = 'smooth') => {
        const clamped = Math.max(1, Math.min(page, totalPages));
        
        if (clamped !== safePage) {
            setCurrentPage(clamped);
        }

        if (scrollBehavior && scrollBehavior !== 'none') {
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: scrollBehavior === 'none' ? 'auto' : scrollBehavior
                });
            }, 50);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxButtons = 7;

        if (totalPages <= maxButtons) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            let start = Math.max(2, safePage - 1);
            let end = Math.min(totalPages - 1, safePage + 1);

            if (safePage <= 3) { start = 2; end = 4; }
            if (safePage >= totalPages - 2) { start = totalPages - 3; end = totalPages - 1; }

            if (start > 2) pages.push('...');
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return {
        currentPage: safePage,
        totalPages,
        visibleItems,
        goToPage,
        getPageNumbers,
        startIndex,
        totalItems,
        itemsPerPage
    };
}
