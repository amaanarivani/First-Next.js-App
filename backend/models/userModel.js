    const { model, Schema } = require('../connection');

    const mySchema = new Schema({
        firstname : String,
        lastname : String,
        email : String,
        password : String,
        confirmpassword : String,
        myFile : String,
    });

   module.exports =  model( 'user', mySchema );