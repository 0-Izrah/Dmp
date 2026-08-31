const express = require('express');
const router = express.Router();
const Dump = require('../models/Dump');
const Photo = require('../models/Photo');
const optionalAuth = require('../middleware/optionalAuth');
const PhotoService = require('../services/photoService');


router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalCount = await Dump.countDocuments({ isPublished: true });
    const dumps = await Dump.find({ isPublished: true })
        .sort({ year: -1, month: -1 })
        .skip(skip)
        .limit(limit);
        
    res.json({
        dumps,
        page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount
    });
});


// Fetch user's own dumps
router.get('/mine', optionalAuth, async (req, res) => {
    const fp = req.user?.sessionId;
    let query = { ownerFingerprint: fp };
    
    // Admin Check
    if (req.user && req.user.role === 'admin') query = {}; // Admin sees all
    
    if (!fp && Object.keys(query).length !== 0) return res.status(401).json({ error: 'Fingerprint required' });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalCount = await Dump.countDocuments(query);
    const dumps = await Dump.find(query)
        .sort({ year: -1, month: -1 })
        .skip(skip)
        .limit(limit);

    const publishedDumpsCount = await Dump.countDocuments({ ...query, isPublished: true });

    const stats = {
        totalDumps: totalCount,
        publishedDumps: publishedDumpsCount,
    };

    res.json({ dumps, stats, page, totalPages: Math.ceil(totalCount / limit), totalCount });
});

// Admin stats removed because we're moving to public/guest model.
// router.get('/all', auth, async (req, res) => { ... });


router.get('/:slug', async (req, res) => {
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
});


router.post('/', optionalAuth, async (req, res) => {
    const fp = req.user?.sessionId;
    if (!fp) return res.status(401).json({ error: 'Session required' });

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
});


router.put('/:id', optionalAuth, async (req, res) => {
    const fp = req.user?.sessionId;
    const existingDump = await Dump.findById(req.params.id);
    
    if (!existingDump) return res.status(404).json({ error: 'Dump not found' });
    
    const isAdmin = req.user && req.user.role === 'admin';
    
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
});

router.delete('/:id', optionalAuth, async (req, res) => {
    const fp = req.user?.sessionId;
    const dump = await Dump.findById(req.params.id).populate('photos');
    if (!dump) {
        return res.status(404).json({ error: 'Dump not found' });
    }
    
    const isAdmin = req.user && req.user.role === 'admin';
    
    if (!isAdmin && dump.ownerFingerprint !== fp) return res.status(403).json({ error: 'Unauthorized to delete this dump' });

    let photosDeletedCount = 0;
    if (dump.photos && dump.photos.length > 0) {
        photosDeletedCount = await PhotoService.deletePhotosForDump(dump.photos);
    }

    await Dump.findByIdAndDelete(req.params.id);

    res.json({
        message: 'Dump and all photos deleted',
        photosDeleted: photosDeletedCount,
    });
});

module.exports = router;