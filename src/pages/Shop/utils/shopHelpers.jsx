import Card from "../components/ProductCard";
import priceParser from "./priceParser";

export const filterByQuery = (products, query) => {
  if (!query) return products;
  return products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );
};

export const filterByAll = (products, { category, price, flavors, cafe }) => {
  let filtered = products;

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  if (price) {
    const range = priceParser(price);
    if (range) {
      const [min, max] = range;
      if (max === Infinity) {
        filtered = filtered.filter(p => Number(p.price) >= min);
      } else {
        filtered = filtered.filter(p => Number(p.price) >= min && Number(p.price) <= max);
      }
    } else {
      // fallback: compare stringwise
      filtered = filtered.filter(p => String(p.price) === String(price));
    }
  }

  if (flavors) {
    filtered = filtered.filter(p => p.flavours === flavors);
  }

  if (cafe) {
    filtered = filtered.filter(p => p.shop === cafe);
  }

  return filtered;
};

export const filteredData = (products, selected, query) => {
  let filteredProducts = filterByQuery(products, query);
  filteredProducts = filterByAll(filteredProducts, selected);
  

  return filteredProducts.map((item, index) => (
    <Card
      key={item.id || index} 
      product={item}
    />
  ));
};