const express = require('express');
const router = express.Router();
const multer = require('multer');
const Photo = require('../models/Photo');
const Dump = require('../models/Dump');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

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
router.post ('/upload' , upload.array('photos' , 20) , async(req , res) =>{
    try{
        const { dumpId } = req.body;
        const dump = await Dump.findById(dumpId);
        if(!dump){
            return res.status(404).json({ error: 'Dump not found' });
        }
        const existingCount = await Photo.countDocuments({ dump: dumpId });
        const uploaded = [];

        for (let i = 0 ; i<req.files.length; i++){
            const file = req.files[i];

            const result = await cloudinary.uploader.upload(file.path , {
                folder: `photo-dump/${dump.slug}`,
                transformation: [
                    {quality: 'auto'},
                    { fetch_format: 'auto' },
                ]
            });
            fs.unlinkSync(file.path);

            let aspectRatio = 'square';
            if(result.width > result.height){
                aspectRatio = 'landscape';
            } else if(result.width < result.height){
                aspectRatio = 'portrait';
            }

            const photo = new Photo({
                url : result.secure_url,
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

            dump.photos.push(photo._id);
            uploaded.push(photo);
        }
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
        const photo = await Photo.findById(req.params.id);
        if(!photo){
            return res.status(404).json({ error: 'Photo not found' });
        }
        await cloudinary.uploader.destroy(photo.publicId);//delete from cloudinary
        await Dump.findByIdAndUpdate(photo.dump , { $pull: { photos: photo._id } });//remove reference from dump
        await Photo.findByIdAndDelete(req.params.id);//delete from db
        res.json({ message: 'Photo deleted successfully' });
    }catch(err){
        res.status(500).json({ error: 'Failed to delete photo' , details: err.message})
    }
});

//update details
router.put('/:id' , async(req,res) => {
    try{
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
        const { orderedIds } = req.body;
        const operations = orderedIds.map((id , index) => Photo.findByIdAndUpdate(id , { order: index }));
        await Promise.all(operations);
        res.json({ message: 'Photos reordered successfully' });
    }catch(err){
        res.status(400).json({ error: 'Failed to reorder photos' , details: err.message})
    }
});

module.exports = router;