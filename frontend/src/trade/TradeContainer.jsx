import React from "react";
import LiveBTC from "./liveBTC";
import BitcoinTrading from "./trading";

const TradeContainer = () => {
  return (
    <>
      <BitcoinTrading />
      <LiveBTC />
    </>
  );
};

export default TradeContainer;
