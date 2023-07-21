const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const fileSchema = new mongoose.Schema({
    
    imageUrl:{
        type:String,
    },
    
});

const File = mongoose.model("File", fileSchema);
module.exports = File;