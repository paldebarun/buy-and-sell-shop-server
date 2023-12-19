const mongoose = require('mongoose');


const Pancardinfo=new mongoose.Schema({
    user:{
     type:String,
     require:true
    },
    number:{
    type:String,
    require:true
   },
   fullname:{
    type:String,
    require:true
   },
   imageUrl:{
    type:String,
    require:true
   },
   aggreement:{
    type:Boolean,
    require:true
   }

});


module.exports=mongoose.model("Pancardinfo",Pancardinfo);