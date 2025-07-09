const express = require('express');
const app = express()

const routeNotFound = async (req, res, next) => {
    res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
}

const errorRouting = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
}

module.exports = { routeNotFound, errorRouting }