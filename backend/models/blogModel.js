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
});

module.exports =  model( 'blog', mySchema );