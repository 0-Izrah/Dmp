const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// For simplicity, we'll use env vars for the admin credentials
// In a real app, this would be a User model in the database
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
// Generate this hash once (see Step 9.5) and put it in .env
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// POST /api/auth/login
router.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;

		// Check username
		if (username !== ADMIN_USERNAME) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Check password against hash
		const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
		if (!isMatch) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Create JWT token
		const token = jwt.sign(
			{ username, role: "admin" },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" },
			// Token expires in 7 days
		);

		res.json({ token, username });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// GET /api/auth/verify — check if a token is still valid
router.get("/verify", (req, res) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.json({ valid: false });
	}

	try {
		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		res.json({ valid: true, user: decoded });
	} catch {
		res.json({ valid: false });
	}
});

module.exports = router;
