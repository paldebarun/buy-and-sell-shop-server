const mongoose = require('mongoose');


const names=new mongoose.Schema({
    user:{
     type:String,
     require:true
    },
   firstName:{
    type:String,
    require:true
   },
   lastName:{
    type:String,
    require:true
   },

   gender:{
    type:String,
    require:true
   },

   


});





module.exports=mongoose.model("profileInfonames",names);