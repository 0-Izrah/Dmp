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
        if (!fp) return res.status(401).json({ error: 'Fingerprint required' });

        const dumps = await Dump.find({ ownerFingerprint: fp }).sort({ year: -1, month: -1 }).populate('photos');

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
        res.json(dump);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dump', details: err.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const fp = req.headers['x-fingerprint'];
        if (!fp) return res.status(401).json({ error: 'Fingerprint required' });

        const dump = new Dump({ ...req.body, ownerFingerprint: fp });
        await dump.save();
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
        if (existingDump.ownerFingerprint !== fp) return res.status(403).json({ error: 'Unauthorized to edit this dump' });

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
        if (dump.ownerFingerprint !== fp) return res.status(403).json({ error: 'Unauthorized to delete this dump' });


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