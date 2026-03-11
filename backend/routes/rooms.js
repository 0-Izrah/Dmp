const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Room = require("../models/Room");

function fingerprintToCode(fingerprint) {
	const hash = crypto.createHash("sha256").update(fingerprint).digest("hex");
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let code = "";
	for (let i = 0; i < 5; i++) {
		const index =
			parseInt(hash.slice(i * 2, i * 2 + 2), 16) % charset.length;
		code += charset[index];
	}
	return code;
}

function randomCode() {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let code = "";
	for (let i = 0; i < 5; i++) {
		code += charset[Math.floor(Math.random() * charset.length)];
	}
	return code;
}

router.get("/my", async (req, res) => {
	try {
		const fingerprint = req.headers["x-fingerprint"];
		if (!fingerprint) {
			return res.status(400).json({ error: "Fingerprint required " });
		}

		const code = fingerprintToCode(fingerprint);

		let room = await Room.findOne({ code, ownerFingerprint: fingerprint })
			.populate("dumps")
			.populate("photos");
		if (!room) {
			room = await Room.create({
				code,
				name: "My Dump",
				ownerFingerprint: fingerprint,
				dumps: [],
				photos: [],
			});
		}
		res.json(room);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/mine", async (req, res) => {
	try {
		const fingerprint = req.headers["x-fingerprint"];
		if (!fingerprint) {
			return res.status(400).json({ error: "Fingerprint required " });
		}

		const rooms = await Room.find({
			ownerFingerprint: fingerprint,
			isActive: true,
		})
			.populate("dumps")
			.populate("photos");
		res.json(rooms);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.post("/", async (req, res) => {
	try {
		const fingerprint = req.headers["x-fingerprint"];
		if (!fingerprint) {
			return res.status(400).json({ error: "Fingerprint required " });
		}
		let code;
		let exists = true;
		while (exists) {
			code = randomCode();
			exists = await Room.findOne({ code });
		}
		const room = await Room.create({
			code,
			name: req.body.name || "Shared Dump",
			ownerFingerprint: fingerprint,
			dumps: req.body.dumps || [],
			photos: req.body.photos || [],
		});
		res.status(201).json(room);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get("/:code", async (req, res) => {
	try {
		const room = await Room.findOne({
			code: req.params.code.toUpperCase(),
			isActive: true,
		})
			.populate({
				path: "dumps",
				populate: { path: "photos", options: { sort: { order: 1 } } },
			})
			.populate("photos");

		if (!room) {
			return res.status(404).json({ error: "Room not found " });
		}
		res.json(room);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.put("/:code", async (req, res) => {
	try {
		const fingerprint = req.headers["x-fingerprint"];
		if (!fingerprint) {
			return res.status(400).json({ error: "Fingerprint required " });
		}

		const room = await Room.findOne({
			code: req.params.code.toUpperCase(),
		});
		if (!room) {
			return res.status(404).json({ error: "Room not found " });
		}
		Object.assign(room, req.body);
		await room.save();
		res.json(room);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.delete("/:code", async (req, res) => {
	try {
		const fingerprint = req.headers["x-fingerprint"];
		if (!fingerprint) {
			return res.status(400).json({ error: "Fingerprint required" });
		}

		const room = await Room.findOne({
			code: req.params.code.toUpperCase(),
		});
		if (!room) {
			return res.status(404).json({ error: "Room not found" });
		}

		if (room.ownerFingerprint !== fingerprint) {
			return res.status(403).json({ error: "Not your room" });
		}

		room.isActive = false;
		await room.save();

		res.json({ message: "Room deactivated" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
