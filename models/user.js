const mongoose = require('mongoose');
const nodemailer=require('nodemailer');

const User = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    cart:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    }

});

User.post("save",async function(doc){
try{
     
    console.log("the document is ",doc);

    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        auth:{
            user:process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    let info = await transporter.sendMail({
        from:`debarun`,
        to: doc.email,
        subject: "User is successfully registered",
        html:`<h2>Hello Jee</h2>`,
    })
    
    console.log("INFO", info);
    console.log("mail sent successfully")

}
catch(error){
  console.log("mail can't be sent");
}
});

module.exports = mongoose.model("User", User);