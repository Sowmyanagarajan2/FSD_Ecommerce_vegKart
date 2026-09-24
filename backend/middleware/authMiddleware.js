const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization; // Get the Authorization header from the request
// Check if the Authorization header is present
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing. No token provided.' });
        }
// Extract the token from the Authorization header
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); // Call the next middleware or route handler if the token is valid
    } catch (error) {
        return res.status(401).json({
            message: "Token expired or invalid"
        });
    }
};

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        next();
    };
};

module.exports = { authMiddleware, authorize };