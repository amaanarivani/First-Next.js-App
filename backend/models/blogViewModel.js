const mongoose = require('mongoose');
const {model, Schema} = require('../connection');

const MySchema = new Schema ({
    blogId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'blog'
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }
})

module.exports = model('blogView', MySchema);