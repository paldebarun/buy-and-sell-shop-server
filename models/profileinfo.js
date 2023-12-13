const mongoose = require('mongoose');


const ProfileInfo=new mongoose.Schema({
    user:{
     type:String,
     require:true
    },
   firstname:{
    type:String,
    require:true
   },
   lastname:{
    type:String,
    require:true
   },

   gender:{
    type:String,
    require:true
   },

   email:{
    type:String,
    require:true
   }


});





module.exports=mongoose.model("profileInfo",ProfileInfo);