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


router.get('/all', auth, async (req, res) => {
    try {
        const dumps = await Dump.find().sort({ year: -1, month: -1 }).populate('photos');


        const totalPhotos = await Photo.countDocuments();
        const stats = {
            totalDumps: dumps.length,
            publishedDumps: dumps.filter(d => d.isPublished).length,
            totalPhotos,
        };

        res.json({ dumps, stats });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dumps', details: err.message });
    }
});


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


router.post('/', auth, async (req, res) => {
    try {
        const dump = new Dump(req.body);
        await dump.save();
        res.status(201).json(dump);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create dump', details: err.message });
    }
});


router.put('/:id', auth, async (req, res) => {
    try {
        const dump = await Dump.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!dump) {
            return res.status(404).json({ error: 'Dump not found' });
        }
        res.json(dump);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update dump', details: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const dump = await Dump.findById(req.params.id).populate('photos');
        if (!dump) {
            return res.status(404).json({ error: 'Dump not found' });
        }


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