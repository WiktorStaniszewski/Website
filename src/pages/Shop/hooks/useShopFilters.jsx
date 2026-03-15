import { useState, useMemo, useCallback, useEffect } from "react";
import { filteredData } from "pages/shop/utils/shopHelpers";
import api from "src/services/api";

export function useShopFilters() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFlavors, setSelectedFlavors] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [selectedProcessing, setSelectedProcessing] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500]); 
  const [query, setQuery] = useState("");

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

  const handleInputChange = useCallback((e) => setQuery(e.target.value), []);
  
  const handleCategoryChange = useCallback((value) => { 
      setSelectedCategory(value);
      setSelectedFlavors(""); 
      setSelectedPurpose(""); 
      setSelectedProcessing(""); 
  }, []);
  
  const handleFlavorsChange = useCallback((value) => setSelectedFlavors(value), []);
  const handleCompanyChange = useCallback((value) => setSelectedCompany(value), []);
  const handlePurposeChange = useCallback((value) => setSelectedPurpose(value), []);
  const handleProcessingChange = useCallback((value) => setSelectedProcessing(value), []);
  const handlePriceRangeChange = useCallback((range) => setPriceRange(range), []);

  const resetFilters = useCallback(() => {
    setSelectedCategory(""); setSelectedFlavors(""); setSelectedCompany("");
    setSelectedPurpose(""); setSelectedProcessing(""); setPriceRange([0, 500]); setQuery("");
  }, []);

  const filteredProducts = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];
    const filtered = filteredData(
      safeProducts,
      {
        category: selectedCategory, flavors: selectedFlavors, company: selectedCompany,
        purpose: selectedPurpose, processing: selectedProcessing, priceRange: priceRange 
      },
      query
    );

    return filtered.sort((a, b) => {
      const aStock = a.availableStock ?? a.stockQuantity ?? 0;
      const bStock = b.availableStock ?? b.stockQuantity ?? 0;
      if (aStock <= 0 && bStock > 0) return 1;
      if (aStock > 0 && bStock <= 0) return -1;
      return 0; 
    });
  }, [products, selectedCategory, selectedFlavors, selectedCompany, selectedPurpose, selectedProcessing, priceRange, query]);

  return {
    query, filteredProducts, loading, error,
    category: selectedCategory, flavors: selectedFlavors, company: selectedCompany, 
    purpose: selectedPurpose, processing: selectedProcessing, priceRange,
    handleInputChange, handleCategoryChange, handleFlavorsChange, handleCompanyChange, 
    handlePurposeChange, handleProcessingChange, handlePriceRangeChange, resetFilters
  };
}