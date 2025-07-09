import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductSwiper from "./components/ProductSwiper";
import AdminPanel from "./components/AdminPanelWithAPI";
import GlobalEffects from "./components/GlobalEffects";
import "./styles/main.css";
import "./styles/components/header.css";
import "./styles/components/product-swiper.css";
import "./styles/components/admin-panel.css";


function App() {
  return (
    <div>
      <GlobalEffects />
      <Header />
      <ProductSwiper />
      <AdminPanel />
    </div>
  );
}

export default App;
