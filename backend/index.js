require('dotenv').config();
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { authenticateToken } = require('./middleware/authmiddleware');
const { getProfile, getMe } = require('./controllers/userController');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/profile", authenticateToken, getProfile);
app.get("/me", authenticateToken, getMe);

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);

module.exports = app;