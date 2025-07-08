import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import productsData from "../data/products.json";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Add delayed property for animation
    const enhancedProducts = productsData.map((product, index) => ({
      ...product,
      delayed: index % 2 === 1,
    }));
    setProducts(enhancedProducts);
  }, []);

  return (
    <section className="products">
      <div className="container">
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Products;
