const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const errorHandler = require('./middleware/errorHandler');
const { errorRouting, routeNotFound } = require('./middleware/routingErrors')

app.use(cors());
app.use(express.json())
app.use(express.static('public'));

//*Mongoose connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Mongoose connected'))
    .catch(err => console.error('DB connection error:', err));

//!Errors Middleware
app.use(errorHandler);
app.use(errorRouting);
app.use(routeNotFound);

//*ROUTING
const pieces = require('./routes/pieces');
const download = require('./routes/download')
app.use('/api/', pieces);
app.use('/api/download', download);

app.get('/error', (req, res, next) => {
    next(new Error("Test error from /error route"));
});

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}, visit http://localhost:${PORT}/`);
});
