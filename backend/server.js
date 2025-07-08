const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const { handleNotFound, handleServerError, handleBadUserRequest } = require('./middleware/responseHelpers')

app.use(cors());
app.use(express.json())
app.use(express.static('public'));

app.get('/', async (req, res) => {

    try {
        res.status(200).json({ message: 'Welcome to blackandblack API' });
    } catch (err) {
        handleServerError(err);
    }
});

app.get('/download', async (req, res) => {

    try {
        return res.download('./public/blackandblackinfo.pdf', 'BlackandBlack Look Book.pdf');
    } catch (err) {
        handleServerError(err);
    }
})

app.get('/error', (req, res, next) => {
    next(new Error("Test error from /error route"));
});

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}, visit http://localhost:${PORT}/`);
});

app.use(async (req, res, next) => {
    res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
})