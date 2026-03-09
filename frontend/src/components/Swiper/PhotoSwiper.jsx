import { Swiper , SwiperSlide } from 'swiper/react';
import {
    EffectCreative,
    Keyboard,
    Mousewheel,
    Pagination,
} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';
import './PhotoSwiper.css';

export default function PhotoSwiper({ photos }) {
    if (!photos || photos.length === 0) {
        return <div className="no-photos">No photos available</div>;
    }

    return (
        <div className="photo-swiper-container">
            <Swiper
                modules = {[EffectCreative , Keyboard,Mousewheel , Pagination]}
                effect = "creative"
                creativeEffect = {{
                    prev: {
                        shadow: true,
                        translate: ["-20%", 0, -1],
                    },
                    next: {
                        translate: ["100%", 0, 0],
                    }
                }}
                keyboard = {{ enabled : true }}
                mousewheel = {{ forceToAxis : true }}
                pagination = {{ clickable : true  , dynamicBullets : true }}
                grabCursor = {true}
                className = "photo-swiper" 
            >
                {photos.map((photo , index) => (
                    <SwiperSlide key = {photo._id} className = "photo-slide">
                        <div className="slide-inner">
                            <img src={photo.url} alt={photo.caption || `Photo ${index +1}`} loading = {index < 3 ? `eager` : `lazy`} />

                            {photo.caption && (
                                <div className="slide-option">
                                    <p className="caption-text">{photo.caption}</p>
                                    {photo.location && (
                                        <span className="caption-location">{photo.location}</span>
                                    )}
                                </div>
                            )}
                            
                        </div>
                        <div className="slide-counter">
                            {index + 1} / {photos.length}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}