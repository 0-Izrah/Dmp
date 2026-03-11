const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();

require('./models/');

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('could not connect to MongoDB...' , err));

app.get('/' , (req , res) => {
    res.json({ message: 'Photo Dump API is running' });
});

app.use('/api/dumps', require('./routes/dumps'));
app.use('/api/photos', require('./routes/photos'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));

app.listen(PORT , () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

