    const { model, Schema } = require('../connection');

    const mySchema = new Schema({
        name : String,
        email : String,
        password : String,
        confirmpassword : String,
    });

   module.exports =  model( 'user', mySchema );