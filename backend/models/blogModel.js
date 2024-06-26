const { model, Schema } = require('../connection');

const mySchema = new Schema({
    title : String,
    description : String,
    userId : String,
    createdAt : Date,
    updatedAt : Date,
    updatedBy : String,
    blogFile : String
});

module.exports =  model( 'blog', mySchema );