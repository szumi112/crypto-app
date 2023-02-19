import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CoinTrending = ({ coin }) => {
  const [priceChange, setPriceChange] = useState(null);

  useEffect(() => {
    const fetchPriceChange = async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coin.id}`
      );
      const data = await response.json();
      setPriceChange(data.market_data?.price_change_percentage_24h);
    };
    fetchPriceChange();
  }, [coin.id]);

  return (
    <li className="anews-trending-item">
      <Link to={`/coin/${coin.id}`} className="anews-trending-link">
        <img
          src={coin.small}
          alt={coin.name}
          className="anews-trending-image"
        />
        <div className="anews-trending-text">
          <p className="anews-trending-name"> {coin.name}</p>
          <small className="anews-trending-symbol">
            ({coin.symbol}){" "}
            {priceChange && (
              <small
                className={`anews-trending-price ${
                  priceChange < 0 ? "agreen" : "ared"
                }`}
              >
                {priceChange.toFixed(2)}%
              </small>
            )}
          </small>
        </div>
      </Link>
    </li>
  );
};

export default CoinTrending;
