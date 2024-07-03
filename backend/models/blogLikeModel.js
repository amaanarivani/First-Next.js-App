const mongoose = require('mongoose');
const {model, Schema} = require ('../connection');

const mySchema = new Schema({
    blogId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'blog'
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
});

module.exports = model('blogLike', mySchema)