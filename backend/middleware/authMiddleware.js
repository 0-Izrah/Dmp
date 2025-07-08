const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer', '');

    if (!token){
        return res.status(401).json({ error: 'Access Denied. No token provided '});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid or expired token' });
    }
};

const authorizeRole = (...allowedRoles) => {
    return ( req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: You do not have permission' });
        }
        next();
    };
};

module.exports = { authenticate, authorizeRole }