import React, { useEffect } from "react";

function GlobalEffects() {
  useEffect(() => {
    // Smooth scrolling for internal links
    const handleSmoothScroll = (e) => {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute("href");
      if (targetId.startsWith("#")) {
        document.querySelector(targetId)?.scrollIntoView({
          behavior: "smooth",
        });
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", handleSmoothScroll);
    });

    // Fade-in animation on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    document.querySelectorAll(".fade-in").forEach((el) => {
      observer.observe(el);
    });

    // Dynamic background grain animation
    const createGrain = () => {
      const grainOverlay = document.createElement("div");
      grainOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.05;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><filter id="noiseFilter"><feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="1" stitchTiles="stitch"/></filter></defs><rect width="100%" height="100%" filter="url(%23noiseFilter)" opacity="0.4"/></svg>');
        z-index: 1;
      `;
      document.body.appendChild(grainOverlay);
    };
    createGrain();

    // Mobile menu toggle
    const mobileBreakpoint = 768;
    const handleResize = () => {
      if (window.innerWidth <= mobileBreakpoint) {
        document.body.classList.add("mobile");
      } else {
        document.body.classList.remove("mobile");
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // Preloader
    window.addEventListener("load", () => {
      document.body.classList.add("loaded");
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener("click", handleSmoothScroll);
      });
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return null;
}

export default GlobalEffects;
