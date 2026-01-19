import { useState, useMemo, useCallback, useEffect } from "react";
import { filteredData } from "pages/shop/utils/shopHelpers";
import api from "src/services/api"; // Import API

export function useShopFilters() {
  // --- Data State ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Filter States ---
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedFlavors, setSelectedFlavors] = useState(null);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [query, setQuery] = useState("");

  // --- Async Fetch ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get("products");
        if (response && response.data) {
          setProducts(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
        setError("Could not load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- Handlers ---
  const handleInputChange = useCallback((e) => setQuery(e.target.value), []);
  const handleCategoryChange = useCallback((e) => setSelectedCategory(e.target.value), []);
  const handlePriceChange = useCallback((e) => setSelectedPrice(e.target.value), []);
  const handleFlavorsChange = useCallback((e) => setSelectedFlavors(e.target.value), []);
  const handleCafeChange = useCallback((e) => setSelectedCafe(e.target.value), []);

  // --- Memoized Filtered Results ---
  const filteredProducts = useMemo(() => {
    return filteredData(
      products, // Now using fetched products
      {
        category: selectedCategory,
        price: selectedPrice,
        flavors: selectedFlavors,
        cafe: selectedCafe,
      },
      query
    );
  }, [products, selectedCategory, selectedPrice, selectedFlavors, selectedCafe, query]);

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
    loading, // Export loading
    error,
    handleInputChange,
    handleCategoryChange,
    handlePriceChange,
    handleFlavorsChange,
    handleCafeChange,
    resetFilters,
  };
}