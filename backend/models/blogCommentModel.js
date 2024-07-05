const mongoose = require ("mongoose");
const {model, Schema} = require("../connection");

const mySchema = new Schema({
    commentOn : String,
    commentBy : String,
    comment : String,
    createdAt : Date,
    updatedAt : Date
})

module.exports =  model( 'blogComment', mySchema );