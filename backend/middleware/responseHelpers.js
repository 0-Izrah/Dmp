const handleServerError = (err, res) => {
    
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
};

const handleNotFound = (resource, res) => {
    if (!resource) {
        return res.status(404).json({ error: 'Not Found' });
    }
    return false;
};

const handleBadUserRequest = (resource, res) => {
    if (!resource) {
        return res.status(400).json({ error: 'Invalid Credentials' });
    }
    return false;
};

module.exports = { handleNotFound, handleServerError, handleBadUserRequest };