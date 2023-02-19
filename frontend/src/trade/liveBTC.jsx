import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

const LiveBTC = () => {
  const [price, setPrice] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(
      "ws://ms-mern-crypto-app.onrender.com/"
      // "ws://localhost:5005"
    );

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "price" && typeof data.data === "string") {
        const price = parseFloat(data.data);
        setPrice(price);
        setPriceHistory((history) => [...history, price]);
        setLoading(false);
      } else {
        setError("Invalid data received from server");
        setLoading(false);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError(error.message);
      setLoading(false);
    };

    ws.onclose = (event) => {
      setError(
        `WebSocket disconnected: code=${event.code} reason=${event.reason}`
      );
      setLoading(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const priceHistoryWithTimestamp = priceHistory.map((price, index) => {
    const timestamp = new Date(
      Date.now() - (priceHistory.length - index) * 1000
    );
    return { price, timestamp };
  });

  return (
    <div className="trading-container w-3/4 mx-auto mt-10">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Line
            data={{
              labels: priceHistoryWithTimestamp.map((data) =>
                data.timestamp.toLocaleTimeString()
              ),
              datasets: [
                {
                  label: "Bitcoin Price",
                  data: priceHistoryWithTimestamp.map((data) => data.price),
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.1)",
                    "rgba(254, 77, 133, 0.5)",
                  ],
                  borderColor: "rgba(255,105,75,1)",
                  borderWidth: 1,
                  fill: "start",
                },
              ],
            }}
          />
        </>
      )}
    </div>
  );
};

export default LiveBTC;
