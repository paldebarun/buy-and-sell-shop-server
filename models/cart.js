const mongoose = require('mongoose');


const Cart = new mongoose.Schema(

    {
        firstName: {
            type: String,
            require: true
        },
        lastName: {
            type: String,
            require: true
        },
        
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ]

    });




    module.exports=mongoose.model("Cart",Cart);