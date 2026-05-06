const express = require('express');
const router = express.Router();
const Dump = require('../models/Dump');
const Photo = require('../models/Photo');
const cloudinary = require('../config/cloudinary');
const auth = require('../middleware/authMiddleware');


router.get('/', async (req, res) => {
    try {
        const dumps = await Dump.find({ isPublished: true }).sort({ year: -1, month: -1 }).populate('photos');
        res.json(dumps);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dumps', details: err.message });
    }
});


// Fetch user's own dumps
router.get('/mine', async (req, res) => {
    try {
        const fp = req.headers['x-fingerprint'];
        let query = { ownerFingerprint: fp };
        
        // Optional Admin Check
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const jwt = require("jsonwebtoken");
            try {
                const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
                if (decoded.role === 'admin') query = {}; // Admin sees all
            } catch (e) {}
        }
        
        if (!fp && Object.keys(query).length !== 0) return res.status(401).json({ error: 'Fingerprint required' });

        const dumps = await Dump.find(query).sort({ year: -1, month: -1 }).populate('photos');

        // Can optionally provide stats
        const stats = {
            totalDumps: dumps.length,
            publishedDumps: dumps.filter(d => d.isPublished).length,
        };

        res.json({ dumps, stats });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dumps', details: err.message });
    }
});

// Admin stats removed because we're moving to public/guest model.
// router.get('/all', auth, async (req, res) => { ... });


router.get('/:slug', async (req, res) => {
    try {
        const dump = await Dump.findOne({ slug: req.params.slug }).populate({ path: 'photos', options: { sort: { order: 1 } } });
        if (!dump) {
            return res.status(404).json({ error: 'Dump not found' });
        }
        
        // Find if it belongs to any room
        const Room = require('../models/Room');
        const room = await Room.findOne({ dumps: dump._id });
        
        const dumpObj = dump.toObject();
        dumpObj.roomCode = room ? room.code : null;

        res.json(dumpObj);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dump', details: err.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const fp = req.headers['x-fingerprint'];
        if (!fp) return res.status(401).json({ error: 'Fingerprint required' });

        const { roomCode, ...dumpData } = req.body;
        const dump = new Dump({ ...dumpData, ownerFingerprint: fp });
        await dump.save();

        if (roomCode) {
            const Room = require('../models/Room');
            await Room.findOneAndUpdate(
                { code: roomCode, ownerFingerprint: fp },
                { $push: { dumps: dump._id } }
            );
        }

        res.status(201).json(dump);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create dump', details: err.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const fp = req.headers['x-fingerprint'];
        const existingDump = await Dump.findById(req.params.id);
        
        if (!existingDump) return res.status(404).json({ error: 'Dump not found' });
        
        let isAdmin = false;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const jwt = require("jsonwebtoken");
            try {
                const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
                if (decoded.role === 'admin') isAdmin = true;
            } catch (e) {}
        }
        
        if (!isAdmin && existingDump.ownerFingerprint !== fp) return res.status(403).json({ error: 'Unauthorized to edit this dump' });

        // Handle room assignment if roomCode is explicitly sent in request body
        if ('roomCode' in req.body) {
            const Room = require('../models/Room');
            const roomCode = req.body.roomCode;
            
            // First, remove the dump from all rooms
            await Room.updateMany(
                { dumps: existingDump._id },
                { $pull: { dumps: existingDump._id } }
            );

            // Then, if a roomCode is provided, add it to that room
            if (roomCode) {
                await Room.findOneAndUpdate(
                    { code: roomCode, ownerFingerprint: fp },
                    { $push: { dumps: existingDump._id } }
                );
            }
            
            // Remove roomCode from req.body since it doesn't belong in Dump schema
            delete req.body.roomCode;
        }

        const dump = await Dump.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(dump);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update dump', details: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const fp = req.headers['x-fingerprint'];
        const dump = await Dump.findById(req.params.id).populate('photos');
        if (!dump) {
            return res.status(404).json({ error: 'Dump not found' });
        }
        
        let isAdmin = false;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const jwt = require("jsonwebtoken");
            try {
                const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
                if (decoded.role === 'admin') isAdmin = true;
            } catch (e) {}
        }
        
        if (!isAdmin && dump.ownerFingerprint !== fp) return res.status(403).json({ error: 'Unauthorized to delete this dump' });


        if (dump.photos && dump.photos.length > 0) {
            const deletePromises = dump.photos.map(photo =>
                cloudinary.uploader.destroy(photo.publicId).catch(() => null)

            );
            await Promise.all(deletePromises);


            await Photo.deleteMany({ dump: dump._id });
        }

        await Dump.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Dump and all photos deleted',
            photosDeleted: dump.photos?.length || 0,
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete dump', details: err.message });
    }
});

module.exports = router;