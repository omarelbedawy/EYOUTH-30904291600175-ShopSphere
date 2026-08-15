require('dotenv').config();
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { authenticateToken } = require('./middleware/authmiddleware');
const { getProfile, getMe } = require('./controllers/userController');
const { requestLogger, errorLogger } = require('./utils/requestLogger');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://kebreet.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like Postman, curl) or from the allowed list
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use('/uploads', express.static('uploads'));


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/profile", authenticateToken, getProfile);
app.get("/me", authenticateToken, getMe);

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString()
    });
});

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);

// Must be registered LAST — Express only routes errors to middleware
// with 4 arguments, and only after every other route/middleware has run.
app.use(errorLogger);

module.exports = app;