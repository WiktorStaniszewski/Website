export const filterByQuery = (products, query) => {
  if (!query) return products;
  return products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );
};

export const filterByAll = (products, { category, flavors, company, purpose, processing, priceRange, showOnlyAvailable }) => {
  let filtered = products;

  if (category) filtered = filtered.filter(p => p.category === category);
  if (company) filtered = filtered.filter(p => p.company === company);
  
  if (flavors) {
    filtered = filtered.filter(p => p.flavours && p.flavours.toLowerCase().includes(flavors.toLowerCase()));
  }
  
  if (purpose) {
    filtered = filtered.filter(p => p.purpose && p.purpose.toLowerCase().includes(purpose.toLowerCase()));
  }
  
  if (processing) {
    filtered = filtered.filter(p => p.processingMethod && p.processingMethod.toLowerCase().includes(processing.toLowerCase()));
  }

  if (showOnlyAvailable) {
    filtered = filtered.filter(p => {
      const stockVal = p.availableStock !== undefined ? p.availableStock : (p.stockQuantity || 0);
      return Number(stockVal) > 0;
    });
  }
  
  if (priceRange && priceRange.length === 2) {
      const [min, max] = priceRange;
      filtered = filtered.filter(p => {
          const productPrice = Number(p.price);
          return productPrice >= min && productPrice <= max;
      });
  }

  return filtered;
};

export const filteredData = (products, selected, query) => {
  let filteredProducts = filterByQuery(products, query);
  filteredProducts = filterByAll(filteredProducts, selected);
  
  return filteredProducts; 
};