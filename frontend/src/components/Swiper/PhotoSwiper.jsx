import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useFocusTrap } from "../../hooks/useAccessibility";
import {
    Navigation,
    EffectCoverflow,
    Keyboard,
    Mousewheel,
    Pagination,
    A11y,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "./PhotoSwiper.css";

export default function PhotoSwiper({ photos }) {
    const [fullscreenImage, setFullscreenImage] = useState(null);

    if (!photos || photos.length === 0) {
        return <div className="no-photos">No photos available</div>;
    }

    const fullscreenRef = useFocusTrap(!!fullscreenImage, () => setFullscreenImage(null));

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') closeFullscreen();
        };

        if (fullscreenImage) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = "";
        };
    }, [fullscreenImage]);

    const openFullscreen = (url, caption) => setFullscreenImage({ url, caption });
    const closeFullscreen = () => setFullscreenImage(null);

    return (
        <section className="photo-swiper-container" aria-label="Photo gallery collection">
            <Swiper
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={"auto"}
                loop = { true }
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                navigation={true}
                keyboard={{ enabled: true, onlyInViewport: true }}
                mousewheel={{ forceToAxis: true }}
                pagination={{ clickable: true }}
                a11y={{
                    prevSlideMessage: "Previous image",
                    nextSlideMessage: "Next image",
                    firstSlideMessage: "This is the first image",
                    lastSlideMessage: "This is the last image",
                    paginationBulletMessage: "Go to image {{index}}",
                }}
                modules={[Navigation, EffectCoverflow, Keyboard, Mousewheel, Pagination, A11y]}
                className="main-swiper photo-swiper"
                role="region"
                aria-label="Photo carousel"
            >
                {photos.map((photo, index) => (
                    <SwiperSlide key={photo._id || index} role="group" aria-label={`Photo ${index + 1} of ${photos.length}`}>
                        <article className="slide-inner">
                            <div className="slide-image-container">
                                <img
                                    src={photo.url}
                                    alt={photo.caption || `Image ${index + 1}`}
                                    loading={index < 3 ? "eager" : "lazy"}
                                    onClick={() => openFullscreen(photo.url, photo.caption)}
                                />
                            </div>

                            <div className="slide-caption">
                                {photo.caption && <h2 className="caption-text">{photo.caption}</h2>}
                                {photo.location && <p className="caption-location">{photo.location}</p>}
                                <div className="slide-counter">
                                    {index + 1} / {photos.length}
                                </div>
                            </div>
                        </article>
                    </SwiperSlide>
                ))}
            </Swiper>

            {fullscreenImage && (
                <div
                    className="fullscreen-overlay"
                    onClick={closeFullscreen}
                    ref={fullscreenRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="fullscreen-title"
                >
                    <div className="fullscreen-container">
                        <button
                            className="fullscreen-close"
                            onClick={closeFullscreen}
                            aria-label="Close fullscreen view"
                        >
                            ✕
                        </button>
                        <img
                            src={fullscreenImage.url}
                            alt={fullscreenImage.caption || "Fullscreen image"}
                            className="fullscreen-image"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div id="fullscreen-title" className="fullscreen-title">
                            {fullscreenImage.caption}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
