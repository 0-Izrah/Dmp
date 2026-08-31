const express = require('express');
const router = express.Router();
const optionalAuth = require('../middleware/optionalAuth');
const multer = require('multer');
const Photo = require('../models/Photo');
const Dump = require('../models/Dump');
const PhotoService = require('../services/photoService');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 10, 
    message: { error: 'Upload limit reached (Max 10 uploads per hour). Please try again later.' }
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'photo-dump/uploads',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp']
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10mb
});

//upload photos to a dump
router.post('/upload', optionalAuth, uploadLimiter, upload.array('photos', 20), async(req, res) => {
    // If dump doesn't exist or user unauthorized, we must cleanup Cloudinary
    const cleanupUploadedFiles = async () => {
        if (req.files && req.files.length > 0) {
            const deletePromises = req.files.map(file => 
                cloudinary.uploader.destroy(file.filename).catch(() => null)
            );
            await Promise.all(deletePromises);
        }
    };

    const fp = req.user?.sessionId;
    const { dumpId } = req.body;
    
    if (!dumpId) {
        await cleanupUploadedFiles();
        return res.status(400).json({ error: "dumpId required" });
    }

    const dump = await Dump.findById(dumpId);
    if (!dump) {
        await cleanupUploadedFiles();
        return res.status(404).json({error: "Dump not found"});
    }
    
    if (dump.ownerFingerprint !== fp) {
        await cleanupUploadedFiles();
        return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const existingCount = await Photo.countDocuments({ dump: dumpId });

    const uploadPromises = req.files.map(async (file, i) => {
        // Fetch detailed resource info to get width/height since multer-storage-cloudinary doesn't return it
        const result = await cloudinary.api.resource(file.filename);

        let aspectRatio = 'square';
        if(result.width > result.height){
            aspectRatio = 'landscape';
        } else if(result.width < result.height){
            aspectRatio = 'portrait';
        }

        const optimizedUrl = result.secure_url.replace('/upload/', '/upload/w_1200,q_auto,f_auto/');

        const photo = new Photo({
            url : optimizedUrl,
            publicId: file.filename,
            width: result.width,
            height: result.height,
            aspectRatio,
            caption: req.body[`caption_${i}`] || '',
            location: req.body[`location_${i}`] || '',
            dump: dumpId,
            order: existingCount + i,
        });
        await photo.save();
        return photo;
    });

    const uploaded = await Promise.all(uploadPromises);

    dump.photos.push(...uploaded.map(p => p._id));

    if(!dump.coverPhoto && uploaded.length > 0 ){
        dump.coverPhoto = uploaded[0].url;
    }
    await dump.save();

    res.status(201).json(uploaded);
});

router.delete('/:id' , optionalAuth, async(req,res) => {
    const fp = req.user?.sessionId;
    const photo = await Photo.findById(req.params.id).populate('dump');
    if(!photo){
        return res.status(404).json({ error: 'Photo not found' });
    }
    
    if (photo.dump && photo.dump.ownerFingerprint !== fp) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    await PhotoService.deletePhoto(photo._id);
    await Dump.findByIdAndUpdate(photo.dump._id , { $pull: { photos: photo._id } });//remove reference from dump
    res.json({ message: 'Photo deleted successfully' });
});

//update details
router.put('/:id' , optionalAuth, async(req,res) => {
    const fp = req.user?.sessionId;
    const existingPhoto = await Photo.findById(req.params.id).populate('dump');
    if (!existingPhoto || (existingPhoto.dump && existingPhoto.dump.ownerFingerprint !== fp)) {
         return res.status(403).json({ error: 'Unauthorized' });
    }

    const photo = await Photo.findByIdAndUpdate(req.params.id , req.body , { new: true, runValidators: true});
    if(!photo){
        return res.status(404).json({ error: 'Photo not found' });
    }
    res.json(photo);
});

//reorder photos 

router.put('/reorder/:dumpId' , optionalAuth, async(req,res) => {
    const fp = req.user?.sessionId;
    const dump = await Dump.findById(req.params.dumpId);
    if (!dump || dump.ownerFingerprint !== fp) {
         return res.status(403).json({ error: 'Unauthorized' });
    }

    const { orderedIds } = req.body;
    const operations = orderedIds.map((id , index) => Photo.findByIdAndUpdate(id , { order: index }));
    await Promise.all(operations);
    res.json({ message: 'Photos reordered successfully' });
});

module.exports = router;