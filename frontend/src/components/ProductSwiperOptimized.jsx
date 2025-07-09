import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, Keyboard, Lazy } from 'swiper/modules';
import productsData from "../data/products.json";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/lazy';


const ProductSlide = React.memo(({ product }) => {
  return (
    <div className="product-slide">
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.title}
          loading="lazy"
          className="swiper-lazy"
        />
        <div className="swiper-lazy-preloader"></div>
      </div>
      <div className="product-details">
        <h2 className="product-title">{product.title}</h2>
        <div className="product-pricing">
          <span className="current-price">{product.price?.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="original-price">{product.originalPrice.toLocaleString()}</span>
          )}
          {product.originalPrice && (
            <span className="discount-badge">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>
        <p className="product-description">{product.description}</p>
        {(product.material || product.sizes) && (
          <div className="product-specs">
            {product.material && (
              <div className="spec-item">
                <span className="spec-label">Material:</span>
                <span className="spec-value">{product.material}</span>
              </div>
            )}
            {product.sizes && product.sizes.length > 0 && (
              <div className="spec-item">
                <span className="spec-label">Sizes:</span>
                <span className="spec-value">{product.sizes.join(', ')}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

ProductSlide.displayName = 'ProductSlide';

function ProductSwiper() {
  const [products, setProducts] = useState([]);

  // Memoize products processing
  const processedProducts = useMemo(() => {
    return productsData.map((product, index) => ({
      ...product,
      delayed: index % 2 === 1,
    }));
  }, []);

  useEffect(() => {
    setProducts(processedProducts);
  }, [processedProducts]);

  // Memoize swiper configuration
  const swiperConfig = useMemo(() => ({
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    navigation: true,
    pagination: {
      clickable: true,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    lazy: {
      loadPrevNext: true,
      loadPrevNextAmount: 2,
    },
    modules: [EffectCoverflow, Navigation, Pagination, Keyboard, Lazy],
    className: "main-swiper"
  }), []);

  // Memoized slide renderer
  const renderSlides = useCallback(() => {
    return products.map((product) => (
      <SwiperSlide key={product.id}>
        <ProductSlide product={product} />
      </SwiperSlide>
    ));
  }, [products]);

  return (
    <div className="product-swiper-container">
      <Swiper {...swiperConfig}>
        {renderSlides()}
      </Swiper>
    </div>
  );
}

export default React.memo(ProductSwiper);
