const handler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Server Error'});
}

module.exports = handler