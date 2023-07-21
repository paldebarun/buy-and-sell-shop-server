const mongoose=require('mongoose');

require('dotenv').config();


exports.databaseConnect=()=>{
 
        mongoose.connect(process.env.DATABASE,{
            useNewUrlParser: true,
            useUnifiedTopology:true,

        }).then(()=>{
            console.log("database is connected successfully");
        }).catch((error)=>{console.log("database not connected successfully")});


    
};



