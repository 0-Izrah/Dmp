import React from 'react';

function ProductCard({ product }) {
  const handleOrderClick = (e) => {
    e.preventDefault();
    const formUrl = 'https://docs.google.com/forms/d/12JbaP2QkU8BPL4tP-SCD8yn1Za_0s6bnSkwOQD5mhUU/edit';
    window.open(formUrl, '_blank');
  };

  return (
    <div className={`product-card fade-in ${product.delayed ? 'delayed' : ''}`}>
      <div className="product-image">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="product-content">
        <h2 className="product-title">{product.title}</h2>
        <p className="product-description">{product.description}</p>
        <a href="#" className="order-btn" data-product={product.id} onClick={handleOrderClick}>
          Order Now
        </a>
      </div>
    </div>
  );
}

export default ProductCard;