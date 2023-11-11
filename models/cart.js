const mongoose = require('mongoose');


const Cart = new mongoose.Schema(

    {
        user:{
          type:mongoose.Schema.Types.ObjectId,
          require:true
        },
        
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ]

    });




    module.exports=mongoose.model("Cart",Cart);