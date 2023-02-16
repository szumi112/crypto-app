const WebSocket = require("ws");

const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@ticker");

const prices = [];

ws.on("message", (data) => {
  const message = JSON.parse(data);
  const price = message.c;

  prices.push(price);

  if (prices.length > 500) {
    prices.shift();
  }
});

module.exports = {
  getPrices: () => prices,
};
