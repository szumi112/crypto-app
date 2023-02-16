const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const crypto = require("./crypto.js");
const http = require("http");
const WebSocket = require("ws");

const User = require("./models/User");

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const uri =
  "mongodb+srv://szumi112:szumek112@clusterlogin.zx7urtn.mongodb.net/?retryWrites=true&w=majority";

app.use(express.json());

mongoose.set("strictQuery", false);
// Connect to MongoDB
mongoose
  .connect(uri, {
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("close", () => {
    console.log("Client disconnected");
    // Handle the disconnection of the client
  });
});

// Broadcast price updates to all connected clients
const broadcastPrice = (price) => {
  console.log("Sending price update:", price);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "price", data: price }));
      // Emit the "price" event with the price data
      client.emit("price", { prices: [price] });
    }
  });
};

// Send price updates at regular intervals
setInterval(() => {
  const prices = crypto.getPrices();
  const price = prices[prices.length - 1];
  broadcastPrice(price);
}, 1000);

// Handle WebSocket connections

// Bitcoin Price endpoint
app.get("/bitcoin-price", cors(), (req, res) => {
  res.json({ prices: crypto.getPrices() });
});

const port = process.env.PORT || 5005;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// // Register a user
// app.post("/register", cors(), (req, res) => {
//   const { email, password } = req.body;

//   User.findOne({ email }).then((user) => {
//     if (user) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     const newUser = new User({
//       email,
//       password,
//     });

//     bcrypt.genSalt(10, (err, salt) => {
//       bcrypt.hash(newUser.password, salt, (err, hash) => {
//         if (err) throw err;
//         newUser.password = hash;
//         newUser
//           .save()
//           .then((user) =>
//             jwt.sign(
//               { id: user.id },
//               "szumek112",
//               { expiresIn: 3600 },
//               (err, token) => {
//                 if (err) throw err;
//                 res.json({
//                   token,
//                   user: {
//                     id: user.id,
//                     email: user.email,
//                   },
//                 });
//               }
//             )
//           )
//           .catch((err) => console.log(err));
//       });
//     });
//   });
// });

// // Login a user
// // Login a user
// app.post("/login", cors(), (req, res) => {
//   const { email, password } = req.body;

//   User.findOne({ email }).then((user) => {
//     if (!user) {
//       return res.status(400).json({ msg: "User does not exist" });
//     }

//     bcrypt.compare(password, user.password).then((isMatch) => {
//       if (!isMatch) {
//         return res.status(400).json({ msg: "Invalid credentials" });
//       }

//       jwt.sign(
//         { id: user.id },
//         "szumek112",
//         { expiresIn: 3600 },
//         (err, token) => {
//           if (err) throw err;
//           res.json({
//             token,
//             user: {
//               id: user.id,
//               email: user.email,
//             },
//           });
//         }
//       );
//     });
//   });
// });

// const port1 = process.env.PORT || 5000;

// app.listen(port1, () => {
//   console.log(`App listening on port ${port1}`);
// });
