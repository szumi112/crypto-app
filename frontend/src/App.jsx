import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import FetchCrypto from "./chartDisplay/FetchCrypto";

import Navigation from "./header/Header";

import CryptoDetail from "./pagesForComponents/CryptoDetail";
import CryptoHome from "./pagesForComponents/CryptoHome";
import "./index.css";
import NewsPage from "./components/news";
import TradeContainer from "./trade/TradeContainer";

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <>
          {/* <Route path="/coins" element={<Coins />} /> */}
          <Route path="/chart" element={<FetchCrypto />} />
          <Route path="/coin/:id" element={<CryptoDetail />} />
          <Route path="/" element={<CryptoHome />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/trade" element={<TradeContainer />} />
        </>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
