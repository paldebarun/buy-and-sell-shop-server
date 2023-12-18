const mongoose = require('mongoose');


const Address=new mongoose.Schema({
    user:{
     type:String,
     require:true
    },
   name:{
    type:String,
    require:true
   },
   mobilenumber:{
    type:String,
    require:true
   },
   pincode:{
    type:String,
    require:true
   },
   locality:{
    type:String,
    require:true
   },
   address:{
    type:String,
    require:true
   },
   city:{
    type:String,
    require:true
   },
   state:{
    type:String,
    require:true
   },
   landmark:{
    type:String,
    require:true
   },
   altphone:{
    type:String,
    require:true
   },
   addresstype:{
    type:String,
    require:true
   },
   latitude:{
    type:Number,
    require:true
   },
   longitude:{
    type:Number,
    require:true
   }

});


module.exports=mongoose.model("Address",Address);