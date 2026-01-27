import { useState, useMemo, useCallback, useEffect } from "react";
import { filteredData } from "pages/shop/utils/shopHelpers";
import api from "src/services/api";

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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get("products");
        

        if (Array.isArray(response)) {
          setProducts(response);
        } else {
          console.error("Invalid data format received:", response);
          setError("Otrzymano nieprawidłowy format danych z serwera.");
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Nie udało się pobrać produktów. Sprawdź połączenie z serwerem.");
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

  const filteredProducts = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    
    return filteredData(
      safeProducts,
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
    loading,
    error,
    handleInputChange,
    handleCategoryChange,
    handlePriceChange,
    handleFlavorsChange,
    handleCafeChange,
    resetFilters,
  };
}