const mongoose = require('mongoose');
const { model, Schema } = require('../connection');

const mySchema = new Schema({
    title : String,
    description : String,
    userId : String,
    createdAt : Date,
    updatedAt : Date,
    updatedBy : String,
    blogFile : String,
    viewCount : Number,
    likeCount : Number,
    likedBy : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }]
    
});

module.exports =  model( 'blog', mySchema );