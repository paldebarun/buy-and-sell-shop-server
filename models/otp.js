const mongoose=require('mongoose');
const nodemailer=require('nodemailer');


const Otp=new mongoose.Schema(
    {
        otpcode:{
            type:String,
            require:true

        },
        email:{
            type:String,
            require:true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 60 * 5, 
        },
    }
);

Otp.post("save",async function(doc){
   try{
      
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
        subject: "otp",
        html:`<h2>Hello Jee this is your otp : ${doc.otpcode}</h2>`,
    })
    
    console.log("INFO", info);
    console.log("otp sent successfully")
   }
   catch(error){
    console.log("otp can't be sent");
   }
})



module.exports=mongoose.model("Otp",Otp);