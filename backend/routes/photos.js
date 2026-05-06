const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware')
const multer = require('multer');
const Photo = require('../models/Photo');
const Dump = require('../models/Dump');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 10, 
    message: { error: 'Upload limit reached (Max 10 uploads per hour). Please try again later.' }
});

const upload = multer({
    dest: path.join(__dirname , '../temp/'),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10mb
    fileFilter: (req, file, cb) => {
        //image only
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
});

//upload photos to a dump
router.post ('/upload' , uploadLimiter, upload.array('photos' , 20) , async(req , res) =>{
    try{
        const fp = req.headers['x-fingerprint'];
        const { dumpId } = req.body;
        const dump = await Dump.findById(dumpId);
        if(!dump){
            return res.status(404).json({error : "Dump not found"});
        }
        if (dump.ownerFingerprint !== fp) return res.status(403).json({ error: 'Unauthorized' });
        const existingCount = await Photo.countDocuments({ dump: dumpId });
        const uploaded = [];

        const uploadPromises = req.files.map(async (file, i) => {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: `photo-dump/${dump.slug}`,
            });
            fs.unlinkSync(file.path);

            let aspectRatio = 'square';
            if(result.width > result.height){
                aspectRatio = 'landscape';
            } else if(result.width < result.height){
                aspectRatio = 'portrait';
            }

            // Optimize for web viewing: auto format, auto quality, and scale down to 1200px max width to preserve bandwidth
            const optimizedUrl = result.secure_url.replace('/upload/', '/upload/w_1200,q_auto,f_auto/');

            const photo = new Photo({
                url : optimizedUrl,
                publicId: result.public_id,
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

        // Run all uploads to Cloudinary in parallel, drastically reducing upload time.
        const uploaded = await Promise.all(uploadPromises);

        dump.photos.push(...uploaded.map(p => p._id));

        if(!dump.coverPhoto && uploaded.length > 0 ){
            dump.coverPhoto = uploaded[0].url;
        }
        await dump.save();

        res.status(201).json(uploaded);
    }catch(err){
        if(req.files){
            req.files.forEach(file => {
                if(fs.existsSync(file.path)) fs.unlinkSync(file.path);
            });
        }
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id' , async(req,res) => {
    try{
        const fp = req.headers['x-fingerprint'];
        const photo = await Photo.findById(req.params.id).populate('dump');
        if(!photo){
            return res.status(404).json({ error: 'Photo not found' });
        }
        
        if (photo.dump && photo.dump.ownerFingerprint !== fp) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await cloudinary.uploader.destroy(photo.publicId);//delete from cloudinary
        await Dump.findByIdAndUpdate(photo.dump._id , { $pull: { photos: photo._id } });//remove reference from dump
        await Photo.findByIdAndDelete(req.params.id);//delete from db
        res.json({ message: 'Photo deleted successfully' });
    }catch(err){
        res.status(500).json({ error: 'Failed to delete photo' , details: err.message})
    }
});

//update details
router.put('/:id' , async(req,res) => {
    try{
        const fp = req.headers['x-fingerprint'];
        const existingPhoto = await Photo.findById(req.params.id).populate('dump');
        if (!existingPhoto || (existingPhoto.dump && existingPhoto.dump.ownerFingerprint !== fp)) {
             return res.status(403).json({ error: 'Unauthorized' });
        }

        const photo = await Photo.findByIdAndUpdate(req.params.id , req.body , { new: true, runValidators: true});
        if(!photo){
            return res.status(404).json({ error: 'Photo not found' });
        }
        res.json(photo);
    }catch(err){
        res.status(400).json({ error: 'Failed to update photo' , details: err.message})
    }
});

//reorder photos 

router.put('/reorder/:dumpId' , async(req,res) => {
    try{
        const fp = req.headers['x-fingerprint'];
        const dump = await Dump.findById(req.params.dumpId);
        if (!dump || dump.ownerFingerprint !== fp) {
             return res.status(403).json({ error: 'Unauthorized' });
        }

        const { orderedIds } = req.body;
        const operations = orderedIds.map((id , index) => Photo.findByIdAndUpdate(id , { order: index }));
        await Promise.all(operations);
        res.json({ message: 'Photos reordered successfully' });
    }catch(err){
        res.status(400).json({ error: 'Failed to reorder photos' , details: err.message})
    }
});

module.exports = router;