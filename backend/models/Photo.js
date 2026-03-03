const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    url:{type: String , required: [true , 'Photo URL is required']},
    publicId: {type :String , required : [ true , 'Cloudinary Public ID is required']},
    caption : { type : String , default : ''},
    location : { type : String , default : ''},
    dump:{ type : mongoose.Schema.Types.ObjectId , ref : 'Dump' , required : true},
    order : { type : Number , default : 0},
    aspectRatio : { type : String , enum:['portrait' , 'landscape' , 'square'] , default : 'portrait'},
    width: Number,
    height: Number,
} , {timestamps: true,});

photoSchema.index ({dump:1 , order:1});

module.exports = mongoose.model('Photo' , photoSchema);

