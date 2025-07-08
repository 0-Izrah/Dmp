import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Storytelling from "./components/Storytelling";
import Footer from "./components/Footer";
import GlobalEffects from "./components/GlobalEffects";
import "./styles/main.css";
import "./styles/components/header.css";
import "./styles/components/hero.css";
import "./styles/components/products.css";
import "./styles/components/product-card.css";
import "./styles/components/storytelling.css";
import "./styles/components/footer.css";

function App() {
  return (
    <div>
      <GlobalEffects />
      <Header />
      <Hero />
      <Products />
      <Storytelling />
      <Footer />
    </div>
  );
}

export default App;
