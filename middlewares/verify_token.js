const httpStatusTexts = require('../utils/http_status_text');
const jwt = require('jsonwebtoken');

const VerifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if (!authHeader) return res.status(401).json({status: httpStatusTexts.ERROR, data: null, ErrorMessage: "token is required"});

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({status: httpStatusTexts.ERROR, data: null, ErrorMessage: "Invalid token format"});
    }

    const token = tokenParts[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({status: httpStatusTexts.ERROR, data: null, ErrorMessage: "Token is not valid"});
        }
        req.user = decoded; // Attach decoded token to request object
        next();
    });
}

module.exports = {
    VerifyToken
}