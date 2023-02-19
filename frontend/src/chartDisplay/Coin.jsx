import React from "react";

const Coin = ({ name, price, image, priceChange }) => {
  return (
    <div className="coin-container stock">
      <img src={image} alt="crypto" />
      <h1>{name}</h1>
      <p className="stockPrice">${price}</p>

      {priceChange < 0 ? (
        <p className="coin-percent redPercent">{priceChange.toFixed(2)}%</p>
      ) : (
        <p className="coin-percent greenPercent">{priceChange.toFixed(2)}%</p>
      )}

      <button className="deleteBtnCoin">x</button>
      <button className="refreshBtnCoin"></button>
    </div>
  );
};

export default Coin;
