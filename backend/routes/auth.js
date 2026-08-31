const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (username !== process.env.ADMIN_USERNAME) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
        { role: "admin", username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({ token });
});

// GET /api/auth/session
// Issues an anonymous JWT session. If migrate_fingerprint is provided, bakes it into the JWT.
router.get("/session", (req, res) => {
    let sessionId = req.query.migrate_fingerprint;
    if (!sessionId) {
        const crypto = require("crypto");
        sessionId = crypto.randomUUID();
    }

    const token = jwt.sign(
        { role: "user", sessionId },
        process.env.JWT_SECRET,
        { expiresIn: "365d" }
    );

    res.json({ token, sessionId });
});

module.exports = router;
