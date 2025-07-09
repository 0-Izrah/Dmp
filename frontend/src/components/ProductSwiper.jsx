import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, Keyboard } from 'swiper/modules';
import productsData from "../data/products.json";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

function ProductSwiper() {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		setProducts(productsData);
	}, []);

	return (
		<div className="product-swiper-container">
			<Swiper
				effect={"coverflow"}
				grabCursor={true}
				centeredSlides={true}
				slidesPerView={"auto"}
				coverflowEffect={{
					rotate: 50,
					stretch: 0,
					depth: 100,
					modifier: 1,
					slideShadows: true,
				}}
				navigation={true}
				pagination={{
					clickable: true,
				}}
				keyboard={{
					enabled: true,
					onlyInViewport: true,
				}}
				modules={[EffectCoverflow, Navigation, Pagination, Keyboard]}
				className="main-swiper"
			>
				{products.map((product) => (
					<SwiperSlide key={product.id}>
						<div className="product-slide">
							<div className="product-image-container">
								<img src={product.image} alt={product.title} />
							</div>              <div className="product-details">
                <h2 className="product-title">{product.title}</h2>
                <div className="product-pricing">
                  <span className="current-price">ev{product.price}</span>
                  {product.originalPrice && (
                    <span className="original-price">{product.originalPrice}</span>
                  )}
                  {product.originalPrice && (
                    <span className="discount-badge">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
                <p className="product-description">{product.description}</p>
                <div className="product-specs">
                  <div className="spec-item">
                    <span className="spec-label">Sizes:</span>
                    <span className="spec-value">{product.sizes?.join(', ')}</span>
                  </div>
                </div>
              </div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}

export default ProductSwiper;
