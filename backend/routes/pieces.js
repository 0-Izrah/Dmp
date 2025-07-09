const express = require('express');
const router = express.Router();
const Piece = require('../models/Piece');
const { handleNotFound, handleServerError } = require('../middleware/responseHelpers');

router.get('/', async (req, res) => {

    try {
        const Pieces = await Piece.find().sort({ createdAt: -1 })
        handleNotFound(Pieces, res);

        return res.status(200).json(Pieces);
    } catch (err) {
        handleServerError(err);
    }
})


module.exports = router;