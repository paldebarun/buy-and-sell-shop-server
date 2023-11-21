const mongoose = require('mongoose');
const nodemailer=require('nodemailer');

const User = new mongoose.Schema({
  id:{
    type:String,
    
  },
   username:{
    type:String,
    require:true
   },

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
   
    phone:{
      type:String,
      require:true
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
        html:`<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>User Registration Notification</title>
          <style>
            /* Add your custom styles here */
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f4;
              color: #333;
              margin: 0;
              padding: 20px;
            }
        
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
        
            h2 {
              color: #007bff;
            }
        
            p {
              line-height: 1.6;
            }
        
            /* Responsive styles */
            @media only screen and (max-width: 600px) {
              body {
                padding: 10px;
              }
        
              .container {
                max-width: 100%;
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Hello ${doc.firstName} ${doc.lastName}!</h2>
            <p>Welcome to our platform. You have been successfully registered.</p>
            <p>If you have any questions or need assistance, feel free to contact us.</p>
            <p>Thank you for joining us!</p>
          </div>
        </body>
        </html>
        `,
    })
    
    console.log("INFO", info);
    console.log("mail sent successfully")

}
catch(error){
  console.log("mail can't be sent");
}
});

module.exports = mongoose.model("User", User);