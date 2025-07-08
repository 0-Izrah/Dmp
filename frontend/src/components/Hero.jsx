import React, { useEffect } from 'react';

function Hero() {
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector('.hero');
      if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">BlackandBlack</h1>
        <p className="hero-subtitle">An unanswered uniform</p>
      </div>
    </section>
  );
}

export default Hero;