const express = require('express');
const router = express.Router();
const Dump = require('../models/Dump');
const auth = require('../middleware/authMiddleware')

//all dumps
router.get('/' , async (req , res) => {
    try {
        const dumps = await Dump.find({isPublished: true}).sort({year:-1 , month:-1}).populate('photos');
        res.json(dumps);
    } catch(err){
        res.status(500).json({ error: 'Failed to fetch dumps' , details: err.message})
    }
});
//single dump
router.get('/:slug' , async(req,res) =>{
    try{
        const dump = await Dump.findOne({ slug: req.params.slug}).populate({path: 'photos' , options:{sort:{order:1}}});
        if(!dump){
            return res.status(404).json({ error: 'Dump not found' });
        }
        res.json(dump);
    }catch (err){
        res.status(500).json({ erroor: 'Failed to fetch dump' , details: err.message})
    }
});
//create new dump
router.post('/' , auth , async (req,res) => {
    try {
        const dump = new Dump(req.body);
        await dump.save();
        res.status(201).json(dump);
    }catch (err){
        res.status(400).json({ error: 'Failed to create dump' , details: err.message})
    }
});
//update dump
router.put('/:id' , auth , async (req,res) => {
    try {
        const dump = await Dump.findByIdAndUpdate(req.params.id , req.body , { new: true, runValidators: true});
        if(!dump){
            return res.status(404).json({ error: 'Dump not found' });
        }
        res.json(dump);
    }catch(err){
        res.status(400).json({ error: 'Failed to update dump' , details: err.message})
    }
});
//delete dump
router.delete('/:id' , auth , async (req,res) => {
    try {
        const dump = await Dump.findByIdAndDelete(req.params.id);
        if(!dump){
            return res.status(404).json({ error: 'Dump not found' });
        }
        res.json({ message: 'Dump deleted successfully' });
    }catch(err){
        res.status(500).json({ error: 'Failed to delete dump' , details: err.message})
    }
});

module.exports = router;