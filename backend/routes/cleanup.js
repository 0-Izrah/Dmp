const express = require('express');
const router = express.Router();
const Dump = require('../models/Dump');
const Photo = require('../models/Photo');
const Room = require('../models/Room');
const PhotoService = require('../services/photoService');


router.post('/', async (req, res) => {
    const secret = req.headers['x-cleanup-secret'];
    if (secret !== process.env.CLEANUP_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }


    const maxAgeDays = parseInt(process.env.CLEANUP_MAX_AGE_DAYS) || 45;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - maxAgeDays);


    const oldDumps = await Dump.find({
        createdAt: { $lt: cutoff },
    }).populate('photos');

    let totalPhotosDeleted = 0;
    let totalDumpsDeleted = 0;

    for (const dump of oldDumps) {

        if (dump.photos && dump.photos.length > 0) {
            const deletedCount = await PhotoService.deletePhotosForDump(dump.photos);
            totalPhotosDeleted += deletedCount;
        }


        await Room.updateMany(
            { dumps: dump._id },
            { $pull: { dumps: dump._id } }
        );


        await Dump.findByIdAndDelete(dump._id);
        totalDumpsDeleted++;
    }

    res.json({
        message: 'Cleanup complete',
        dumpsDeleted: totalDumpsDeleted,
        photosDeleted: totalPhotosDeleted,
        cutoffDate: cutoff.toISOString(),
    });
});


router.get('/preview', async (req, res) => {
    const secret = req.headers['x-cleanup-secret'];
    if (secret !== process.env.CLEANUP_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const maxAgeDays = parseInt(process.env.CLEANUP_MAX_AGE_DAYS) || 45;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - maxAgeDays);

    const oldDumps = await Dump.find({
        createdAt: { $lt: cutoff },
    }).populate('photos');

    const totalPhotos = oldDumps.reduce((sum, d) => sum + (d.photos?.length || 0), 0);

    res.json({
        wouldDelete: oldDumps.map(d => ({
            title: d.title,
            createdAt: d.createdAt,
            photoCount: d.photos?.length || 0,
        })),
        totalDumps: oldDumps.length,
        totalPhotos,
        cutoffDate: cutoff.toISOString(),
    });
});

module.exports = router;