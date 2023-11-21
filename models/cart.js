const mongoose = require('mongoose');


const Cart = new mongoose.Schema(

    {
        
        
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ]

    });




    module.exports=mongoose.model("Cart",Cart);