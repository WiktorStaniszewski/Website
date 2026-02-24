import { useState, useMemo, useCallback, useEffect } from "react";
import { filteredData } from "pages/shop/utils/shopHelpers";
import api from "src/services/api";

export function useShopFilters() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleInputChange = useCallback((e) => setQuery(e.target.value), []);
  const handleCategoryChange = useCallback((e) => setSelectedCategory(e.target.value), []);
  const handlePriceChange = useCallback((e) => setSelectedPrice(e.target.value), []);
  const handleFlavorsChange = useCallback((e) => setSelectedFlavors(e.target.value), []);
  const handleCafeChange = useCallback((e) => setSelectedCafe(e.target.value), []);

  const filteredProducts = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    
    const filtered = filteredData(
      safeProducts,
      {
        category: selectedCategory,
        price: selectedPrice,
        flavors: selectedFlavors,
        cafe: selectedCafe,
      },
      query
    );

    return filtered.sort((a, b) => {
      const aStock = a.availableStock !== undefined ? a.availableStock : (a.stockQuantity || 0);
      const bStock = b.availableStock !== undefined ? b.availableStock : (b.stockQuantity || 0);

      const aIsSoldOut = aStock <= 0;
      const bIsSoldOut = bStock <= 0;

      if (aIsSoldOut && !bIsSoldOut) return 1;
      if (!aIsSoldOut && bIsSoldOut) return -1;
      
      return 0; 
    });
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