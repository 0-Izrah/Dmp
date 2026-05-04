const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
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
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/auth/verify — verify token
router.get("/verify", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.json({ isAdmin: false, needsSetup: false });
    }

    const token = authHeader.split(" ")[1];
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        res.json({ isAdmin: true, needsSetup: false });
    } catch (err) {
        res.json({ isAdmin: false, needsSetup: false });
    }
});

module.exports = router;
