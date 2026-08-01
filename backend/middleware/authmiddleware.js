const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    });
}

function requireAdmin(req, res, next) {
    if (req.role !== "ADMIN") {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
}

module.exports = { authenticateToken, requireAdmin };
