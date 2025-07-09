const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../public/blackandblackinfo.pdf');
        return res.download(filePath);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error.');
    }
});

module.exports = router;
