const mongoose = require('mongoose');
const nodemailer=require('nodemailer');

const Product=new mongoose.Schema({
    user:{
     type:String,
     required:true
    },
   title:{
    type:String,
    require:true
   },

   description:{
    type:String,
    require:true
   },

   image:{
    type:String,
    require:true
   },

   price:{
    type:Number,
    require:true
   },

   category:{
    type:String,
    require:true
   },
   email:{
    type:String,
    require:true
   },
   users:[{
    type:String,
    
   }]


});





module.exports=mongoose.model("Product",Product);