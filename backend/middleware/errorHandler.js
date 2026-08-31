module.exports = function errorHandler(err, req, res, next) {
    console.error(err);

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message, details: err.errors });
    }

    // Mongoose Cast Error (Invalid ID)
    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Generic fallback
    res.status(500).json({ 
        error: 'An unexpected error occurred on the server.', 
        details: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
};
