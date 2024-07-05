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
    commentCount : Number,
    likedBy : [{
        type : String,
    }],
    comment : [{
        type : String,
    }]
    
});

module.exports =  model( 'blog', mySchema );