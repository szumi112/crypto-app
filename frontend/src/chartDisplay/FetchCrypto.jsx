import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import CoinSearchBar from "./CoinSearchBar";
import useLocalStorage from "../customHooks/UseLocalStorage";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function FetchCrypto() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [cryptolist, setCryptolist] = useLocalStorage("watchlist", [{}]);
  const [historic, setHistoric] = useState([]);
  const [days, setDays] = useState(1);
  const [crypto, setCrypto] = useState("bitcoin");

  const HistoricalChart = `https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=${days}`;

  useEffect(() => {
    axios
      .get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      )
      .then((res) => {
        setCoins(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    axios
      .get(HistoricalChart)
      .then((res) => {
        setHistoric(res.data.prices);
      })
      .catch((error) => console.log(error));
  }, [days, crypto]);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e, i) => {
    e.preventDefault();
    setCryptolist([
      ...cryptolist,
      {
        id: filteredCoins[i]["id"],
        current_price: filteredCoins[i]["current_price"],
        name: filteredCoins[i]["name"],
        symbol: filteredCoins[i]["symbol"],
        image: filteredCoins[i]["image"],
        price_change_percentage_24h:
          filteredCoins[i]["price_change_percentage_24h"],
      },
    ]);
  };

  let removeHandler = (e) => {
    e.preventDefault();
    let x = e.target.getAttribute("removecoin");
    setCryptolist(cryptolist.filter((items) => items.id !== x));
  };

  const uniqueCryptos = Array.from(
    cryptolist
      .reduce((map, obj) => map.set(obj.symbol, obj), new Map())
      .values()
  );

  var data = {
    labels: historic.map((coin) => {
      let date = new Date(coin[0]);
      let time =
        date.getHours() > 12
          ? `${date.getHours() - 12}:${date.getMinutes()} PM`
          : `${date.getHours()}:${date.getMinutes()} AM`;
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: `${crypto} Data`,
        data: historic.map((coin) => coin[1]),
        backgroundColor: "rgba(255,116,89,0.05)",
        borderColor: "rgba(255,105,75,1)",
        borderWidth: 2,
        pointBorderColor: "#2984c5",
        pointBackgroundColor: "#fff",
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "black",
        fill: true,
        pointHoverBorderColor: "rgba(41, 132, 197, 1)",
        pointHoverBorderWidth: 7,
        pointRadius: 0,
        pointHitRadius: 30,
        tension: 0.3,
      },
    ],
  };

  var options = {
    plugins: {
      legend: {
        display: "",
        labels: {
          color: "white",
          font: {
            size: 30,
            family: "verdana",
          },
        },
      },
    },
    maintainAspectRatio: true,
    responsive: true,
    radius: 3,
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
          color: "rgba(210,230,244,1)",
          font: {
            size: 12,
            family: "Verdana", // Add your font here to change the font of your legend label
          },
        },
        grid: {
          color: "rgba(255,255,255,0.02)",
        },
      },
      x: {
        grid: {
          color: "rgba(255,255,255,0.02)",
        },
        ticks: {
          color: "rgba(210,230,244,1)",
          font: {
            family: "Verdana", // Add your font here to change the font of your legend label
          },
        },
      },
    },
  };

  return (
    <>
      <div className="coin-search" onClick={() => setSearch("")}>
        <h1 className="coin-text mt-8 text-2xl">Search a currency</h1>
        <h5 className="coin-text">
          Currently displaying: <span>{crypto.toUpperCase()}</span>
        </h5>
        <form>
          <input
            className="coin-input specialMarginForInput"
            type="text"
            onChange={handleChange}
            onClick={() => setSearch("")}
            placeholder="Search"
          />
        </form>
        <div className="coin coin-search-horizontal">
          {filteredCoins.slice(0, 5).map((coin, i) => {
            return search ? (
              <div
                onClick={function (e) {
                  handleAdd(e, i);
                  setCrypto(coin.id.toLowerCase());
                }}
              >
                <CoinSearchBar key={coin.index} name={coin.name} />
              </div>
            ) : (
              <div key={coin.id} className="displaynone"></div>
            );
          })}
        </div>
      </div>

      <div className="cryptoContainer">
        <div className="chartcont">
          <Line data={data} height={500} width={700} options={options} />
        </div>
        <div className="cryptoChartDates">
          <button
            class="inline-block px-6 py-2 border-x-2 border-gray-400 text-gray-200 bg-white bg-opacity-5 font-medium text-xs leading-tight uppercase rounded hover:bg-white hover:bg-opacity-30 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            onClick={() => setDays(1)}
          >
            24 Hours
          </button>
          <button
            class="inline-block px-6 py-2 border-x-2 border-gray-400 text-gray-200 bg-white bg-opacity-5 font-medium text-xs leading-tight uppercase rounded hover:bg-white hover:bg-opacity-30 focus:outline-none focus:ring-0 transition duration-170 ease-in-out"
            onClick={() => setDays(7)}
          >
            1 Week
          </button>
          <button
            class="inline-block px-6 py-2 border-x-2 border-gray-400 text-gray-200 bg-white bg-opacity-5 font-medium text-xs leading-tight uppercase rounded hover:bg-white hover:bg-opacity-30 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            onClick={() => setDays(30)}
          >
            1 Month
          </button>
          <button
            class="inline-block px-6 py-2 border-x-2 border-gray-400 text-gray-200 bg-white bg-opacity-5 font-medium text-xs leading-tight uppercase rounded hover:bg-white hover:bg-opacity-30 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            onClick={() => setDays(90)}
          >
            3 Months
          </button>
          <button
            class="inline-block px-6 py-2 border-x-2 border-gray-400 text-gray-200 bg-white bg-opacity-5 font-medium text-xs leading-tight uppercase rounded hover:bg-white hover:bg-opacity-30 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            onClick={() => setDays(365)}
          >
            1 Year
          </button>
          <button
            class="inline-block px-6 py-2 border-x-2 border-gray-400 text-gray-200 bg-white bg-opacity-5 font-medium text-xs leading-tight uppercase rounded hover:bg-white hover:bg-opacity-30 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            onClick={() => setDays(1095)}
          >
            3 Years
          </button>
          <button
            class="inline-block px-6 py-2 border-x-2 border-gray-400 text-gray-200 bg-white bg-opacity-5 font-medium text-xs leading-tight uppercase rounded hover:bg-white hover:bg-opacity-30 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            onClick={() => setDays(1825)}
          >
            5 Years
          </button>
        </div>
        <div className="coin-app coin-margin text-center mt-10">
          <h1 className="coin-text mt-10 text-2xl">Recently searched:</h1>
          <div className="coin ">
            {uniqueCryptos.map((coin) => {
              return coin.id ? (
                <div
                  className="coin-container stock"
                  onClick={() => setCrypto(coin.id.toLowerCase())}
                >
                  <img src={coin.image} alt="crypto" />
                  <h1>{coin.name}</h1>
                  <p className="stockPrice">${coin.current_price.toFixed(2)}</p>

                  {coin.price_change_percentage_24h < 0 ? (
                    <p className="coin-percent redPercent">
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </p>
                  ) : (
                    <p className="coin-percent greenPercent">
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </p>
                  )}

                  <button
                    className="deleteBtnCoin"
                    removecoin={coin.id}
                    onClick={removeHandler}
                  >
                    x
                  </button>
                </div>
              ) : (
                <div key={coin.id} className="displaynone">
                  {" "}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default FetchCrypto;
