import { Link } from "react-router-dom";

const CoinTrending = ({ coin }) => {
  return (
    <Link to={`/coin/${coin.id}`} className="coin-trending-link">
      <div className="coin-trending-container">
        <div className="coin-trending-content">
          <span className="coin-trending-score">{coin.score + 1}.</span>
          <img
            src={coin.small}
            alt={coin.name}
            className="coin-trending-image"
          />
          <div className="coin-trending-text">
            <p className="coin-trending-name"> {coin.name}</p>
            <small className="coin-trending-symbol">({coin.symbol})</small>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CoinTrending;
