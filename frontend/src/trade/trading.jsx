import React, { useState, useEffect } from "react";
import Pagination from "./pagination";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BitcoinTrading = () => {
  const [price, setPrice] = useState(localStorage.getItem("price") || 0);
  const [amount, setAmount] = useState(localStorage.getItem("amount") || 0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [initialEntryPrice, setInitialEntryPrice] = useState(
    localStorage.getItem("initialEntryPrice") || 0
  );
  const [isBuying, setIsBuying] = useState(
    localStorage.getItem("isBuying") || true
  );
  const [closedTrades, setClosedTrades] = useState(
    JSON.parse(localStorage.getItem("closedTrades") || "[]")
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [tradesPerPage, setTradesPerPage] = useState(5);

  const ws = new WebSocket(
    "wss://ms-mern-crypto-app.onrender.com/"
    // "ws://localhost:5005"
  );

  useEffect(() => {
    const ws = new WebSocket(
      "wss://ms-mern-crypto-app.onrender.com/"
      // "ws://localhost:5005"
    );

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "price") {
        const newPrice = parseFloat(message.data);
        setPrice(newPrice);
        localStorage.setItem("price", newPrice);
      } else {
        setError("Invalid data received from server");
      }
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
      setError(event.message);
    };

    ws.onclose = (event) => {
      setError(
        `WebSocket disconnected: code=${event.code} reason=${event.reason}`
      );
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    setValue(price * amount);
    localStorage.setItem("amount", amount);
  }, [price, amount]);

  const handleBuyClick = () => {
    if (amount === 0) {
      setError("Please enter a valid amount");
      return;
    }
    setError("");
    setInitialEntryPrice(price);
    setIsBuying(true);
    alert(`You bought ${amount} Bitcoin for $${price * amount}`);
    localStorage.setItem("initialEntryPrice", price);
    localStorage.setItem("isBuying", true);
  };

  const handleShortSellClick = () => {
    if (amount === 0) {
      setError("Please enter a valid amount");
      return;
    }
    setError("");
    setInitialEntryPrice(price);
    setIsBuying(false);
    alert(`You short sold ${amount} Bitcoin for $${price * amount}`);
    localStorage.setItem("initialEntryPrice", price);
    localStorage.setItem("isBuying", false);
  };

  const handleCloseTrade = () => {
    const closePrice = price;
    const profit = isBuying
      ? (closePrice - initialEntryPrice) * amount
      : (initialEntryPrice - closePrice) * amount;
    const closedTrade = {
      entryPrice: initialEntryPrice,
      exitPrice: closePrice,
      amount: amount,
      isBuying: isBuying,
      profit: profit.toFixed(2),
    };

    setClosedTrades((prevClosedTrades) => [...prevClosedTrades, closedTrade]);
    localStorage.setItem(
      "closedTrades",
      JSON.stringify([...closedTrades, closedTrade])
    );

    localStorage.removeItem("initialEntryPrice");
    setInitialEntryPrice(0);
    setIsBuying(true);
  };

  const handleClearHistory = () => {
    setClosedTrades([]);
    localStorage.removeItem("closedTrades");
  };

  const profitLoss = initialEntryPrice
    ? isBuying
      ? (price - initialEntryPrice) * amount
      : (initialEntryPrice - price) * amount
    : 0;

  const indexOfLastTrade = currentPage * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;
  const currentTrades = closedTrades.slice(indexOfFirstTrade, indexOfLastTrade);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalProfitLoss = closedTrades.reduce((total, trade) => {
    const tradeProfitLoss = trade.isBuying
      ? (trade.exitPrice - trade.entryPrice) * trade.amount
      : (trade.entryPrice - trade.exitPrice) * trade.amount;

    return total + tradeProfitLoss;
  }, 0);

  useEffect(() => {
    if (error) {
      toast.warning(
        "Check if the chart on the bottom is moving. We use free data, and the app might not work perfectly at all times. Please be patient and wait a lil bit, if something isn't working. 😊",
        { autoClose: true }
      );
    }
  }, [error]);

  return (
    <div className="trading-container">
      <ToastContainer />
      <h1 className="text-2xl mb-2 text-gray-200 mt-8">Bitcoin Trading</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p className="mb-2 text-gray-300 mt-6">
            Current Price: ${parseFloat(price).toFixed(2)}
          </p>
          <div className="mb-2">
            <label htmlFor="amount" className="text-gray-400 my-6">
              Amount:
            </label>
            <div className="text-gray-800 my-6">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-100 p-2 rounded-lg"
              />
            </div>
          </div>
          {initialEntryPrice > 0 && (
            <p className="text-gray-300">
              Profit/Loss: ${profitLoss.toFixed(2)}
            </p>
          )}
          <button
            onClick={handleBuyClick}
            className="bg-green-500 p-2 rounded-lg text-white mr-2"
          >
            Buy
          </button>
          <button
            onClick={handleShortSellClick}
            className="bg-red-500 p-2 rounded-lg text-white"
          >
            Short Sell
          </button>
          {initialEntryPrice !== 0 && (
            <button
              onClick={handleCloseTrade}
              className="bg-yellow-500 p-2 rounded-lg text-white mr-2"
            >
              Close Trade
            </button>
          )}

          <div className="mt-6">
            <h2 className="text-xl font-medium text-gray-200 mb-2">
              Trade History
            </h2>
            {closedTrades.length > 0 ? (
              <>
                <table className="table-auto w-full text-gray-800">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-gray-400">Amount</th>
                      <th className="px-4 py-2 text-gray-400">Entry Price</th>
                      <th className="px-4 py-2 text-gray-400">Exit Price</th>
                      <th className="px-4 py-2 text-gray-400">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTrades.map((trade, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2 text-right text-gray-300">
                          {trade.amount}
                        </td>
                        <td className="border px-4 py-2 text-right text-gray-300">
                          {parseFloat(trade.entryPrice).toFixed(2)}
                        </td>
                        <td className="border px-4 py-2 text-right text-gray-300">
                          {parseFloat(trade.exitPrice).toFixed(2)}
                        </td>
                        <td
                          className={`border px-4 py-2 text-right ${
                            trade.profit >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {trade.profit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4">
                  <Pagination
                    tradesPerPage={tradesPerPage}
                    totalTrades={closedTrades.length}
                    paginate={paginate}
                    currentPage={currentPage}
                    closedTrades={closedTrades}
                  />
                </div>

                <p className="mb-2 mt-10 text-gray-300">
                  Total Profit/Loss: ${totalProfitLoss.toFixed(2)}
                </p>
                <button
                  onClick={handleClearHistory}
                  className=" bg-white hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                >
                  Clear History
                </button>
              </>
            ) : (
              <p className="text-gray-300">No trades have been closed yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default BitcoinTrading;
