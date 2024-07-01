const mongoose = require('mongoose');
const {model, Schema} = require ('../connection');

const mySchema = new Schema({
    blogId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'blog'
    },
    likes : [{
        userId : String,
        isBlogLiked : { type : Boolean, default: false}
    }]
    
});

module.exports = model('blogLike', mySchema)