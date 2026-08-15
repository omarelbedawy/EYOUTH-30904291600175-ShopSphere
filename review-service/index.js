require('dotenv').config();
const express = require('express');
const cors = require('cors');

const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

app.use(express.json());

// Same two origins as the main backend — this service is called directly
// from the ShopSphere frontend, so it needs its own CORS config.
const allowedOrigins = [
    "http://localhost:5173",
    "https://kebreet.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}));

app.get("/", (req, res) => {
    res.send("ShopSphere Review Service");
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use('/reviews', reviewRoutes);

module.exports = app;
