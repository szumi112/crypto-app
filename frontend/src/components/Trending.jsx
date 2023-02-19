import { useEffect, useState } from "react";
import fetchAxios from "../customHooks/fetchAxios";
import CoinTrending from "./coinTrending";
import Skeleton from "./Skeleton";

const Trending = () => {
  const { response, loading } = fetchAxios("search/trending");
  const [coinData, setCoinData] = useState([]);

  useEffect(() => {
    const fetchCoinData = async () => {
      const data = [];
      for (let coin of response.coins) {
        const coinData = await fetchAxios(`coins/${coin.item.id}`);
        data.push({
          id: coin.item.id,
          price_change_percentage_24h:
            coinData.response.market_data.price_change_percentage_24h,
        });
      }
      setCoinData(data);
    };
    if (response) {
      fetchCoinData();
    }
  }, [response]);

  const newsContainer = document.querySelector(".anews-container");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        newsContainer.classList.add("fixed");
      } else {
        newsContainer.classList.remove("fixed");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [newsContainer]);

  if (loading) {
    return (
      <div className="anews-container">
        <div className="atitle">Trending:</div>
        <ul>
          <Skeleton className="anews-trending-item" />
          <Skeleton className="anews-trending-item" />
          <Skeleton className="anews-trending-item" />
        </ul>
      </div>
    );
  }

  return (
    <div className="anews-container">
      <div className="atitle">Trending:</div>
      <ul>
        {response &&
          response.coins.map((coin, index) => (
            <CoinTrending
              key={coin.item.coin_id}
              coin={coin.item}
              priceChange={coinData[index]?.price_change_percentage_24h}
            />
          ))}
      </ul>
    </div>
  );
};

export default Trending;
