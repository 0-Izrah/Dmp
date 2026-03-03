const mongoose = require('mongoose');

const dumpSchema = new mongoose.Schema({
    title: {type : String , required :[true , 'Title is required']},
    slug:{type :String , required :[true , 'Slug is required'] , unique:true , lowercase:true,},
    description:{type: String , default:'' },
    coverPhoto:{type:String , default:''},
    month:{type : Number , required: true, min :1,max:12},
    year :{type:Number, required:true},
    tags:{type:[String], default:[]},
    isPublished:{type:Boolean , default:false},
    photos:[{type: mongoose.Schema.Types.ObjectId , ref:'Photo'}],
} , {timestamps:true});

// dumpSchema.index({month : 1 , year:1 , {unique:true}});

module.exports = mongoose.model('Dump', dumpSchema);

