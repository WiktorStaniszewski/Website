import { useState, useMemo, useCallback } from "react";
import { filteredData } from "pages/Shop/SFunctions/ShopFunctions.jsx";
import products from "pages/Shop/Sdb/shopData.jsx";

export function useShopFilters() {
  // --- Filter States ---
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedFlavors, setSelectedFlavors] = useState(null);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [query, setQuery] = useState("");

  // --- Handlers ---
  const handleInputChange = useCallback((e) => setQuery(e.target.value), []);
  const handleCategoryChange = useCallback((e) => setSelectedCategory(e.target.value), []);
  const handlePriceChange = useCallback((e) => setSelectedPrice(e.target.value), []);
  const handleFlavorsChange = useCallback((e) => setSelectedFlavors(e.target.value), []);
  const handleCafeChange = useCallback((e) => setSelectedCafe(e.target.value), []);

  // --- Memoized Filtered Results ---
  const filteredProducts = useMemo(() => {
    return filteredData(
      products,
      {
        category: selectedCategory,
        price: selectedPrice,
        flavors: selectedFlavors,
        cafe: selectedCafe,
      },
      query
    );
  }, [selectedCategory, selectedPrice, selectedFlavors, selectedCafe, query]);

  // --- Reset all filters (optional helper) ---
  const resetFilters = useCallback(() => {
    setSelectedCategory(null);
    setSelectedPrice(null);
    setSelectedFlavors(null);
    setSelectedCafe(null);
    setQuery("");
  }, []);

  return {
    query,
    filteredProducts,
    handleInputChange,
    handleCategoryChange,
    handlePriceChange,
    handleFlavorsChange,
    handleCafeChange,
    resetFilters,
  };
}
