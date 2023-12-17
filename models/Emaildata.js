const mongoose = require('mongoose');


const Emaildata=new mongoose.Schema({
    user:{
     type:String,
     require:true
    },
   email:{
    type:String,
    require:true
   }

});


module.exports=mongoose.model("Emaildata",Emaildata);