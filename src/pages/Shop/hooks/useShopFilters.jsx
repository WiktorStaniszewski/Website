import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { filteredData } from "pages/shop/utils/shopHelpers";
import api from "src/services/api";

export function useShopFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedFlavors, setSelectedFlavors] = useState(searchParams.get("flavors") || "");
  const [selectedCompany, setSelectedCompany] = useState(searchParams.get("company") || "");
  const [selectedPurpose, setSelectedPurpose] = useState(searchParams.get("purpose") || "");
  const [selectedProcessing, setSelectedProcessing] = useState(searchParams.get("processing") || "");
  const [priceRange, setPriceRange] = useState([0, 500]); 
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState("newest");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get("products");
        if (Array.isArray(response)) setProducts(response);
      } catch (err) {
        setError("Nie udało się pobrać produktów.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleInputChange = useCallback((e) => setQuery(e.target.value), []);
  
  const handleCategoryChange = useCallback((value) => { 
      setSelectedCategory(value);
      setSelectedFlavors(""); 
      setSelectedPurpose(""); 
      setSelectedProcessing(""); 
      setSearchParams(prev => {
        if (value) prev.set("category", value);
        else prev.delete("category");
        prev.delete("purpose");
        prev.delete("flavors");
        prev.delete("processing");
        return prev;
      });
  }, [setSearchParams]);
  
  const handleFlavorsChange = useCallback((value) => setSelectedFlavors(value), []);
  const handleCompanyChange = useCallback((value) => setSelectedCompany(value), []);
  const handlePurposeChange = useCallback((value) => {
    setSelectedPurpose(value);
    setSearchParams(prev => {
      if (value) prev.set("purpose", value);
      else prev.delete("purpose");
      return prev;
    });
  }, [setSearchParams]);
  const handleProcessingChange = useCallback((value) => setSelectedProcessing(value), []);
  const handlePriceRangeChange = useCallback((range) => setPriceRange(range), []);
  const handleSortChange = useCallback((value) => setSortBy(value), []);
  const handleAvailabilityChange = useCallback((value) => setShowOnlyAvailable(value), []);

  const resetFilters = useCallback(() => {
    setSelectedCategory(""); setSelectedFlavors(""); setSelectedCompany("");
    setSelectedPurpose(""); setSelectedProcessing(""); setPriceRange([0, 500]); setQuery("");
    setShowOnlyAvailable(false);
    setSearchParams({});
  }, [setSearchParams]);

  const filteredProducts = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    let filtered = filteredData(
      safeProducts,
      {
        category: selectedCategory, flavors: selectedFlavors, company: selectedCompany,
        purpose: selectedPurpose, processing: selectedProcessing, priceRange: priceRange,
        showOnlyAvailable: showOnlyAvailable
      },
      debouncedQuery
    );

    filtered = [...filtered].sort((a, b) => {
      const aStock = a.availableStock ?? a.stockQuantity ?? 0;
      const bStock = b.availableStock ?? b.stockQuantity ?? 0;
      if (aStock <= 0 && bStock > 0) return 1;
      if (aStock > 0 && bStock <= 0) return -1;

      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

    return filtered;
  }, [products, selectedCategory, selectedFlavors, selectedCompany, selectedPurpose, selectedProcessing, priceRange, debouncedQuery, sortBy, showOnlyAvailable]);

  return {
    query, filteredProducts, loading, error,
    category: selectedCategory, flavors: selectedFlavors, company: selectedCompany, 
    purpose: selectedPurpose, processing: selectedProcessing, priceRange, sortBy, showOnlyAvailable,
    handleInputChange, handleCategoryChange, handleFlavorsChange, handleCompanyChange, 
    handlePurposeChange, handleProcessingChange, handlePriceRangeChange, handleSortChange, handleAvailabilityChange, resetFilters
  };
}