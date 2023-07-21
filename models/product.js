const mongoose=require('mongoose');

const Product=new mongoose.Schema({
    name:{
        type:String,
        require:true
      },
      info:{
        type:String,
        require:true,
      },
      imageUrl:{
       type:String,
       require:true
      },
      price:{
        type:Number,
        require:true
      },
      sellerName:{
        type:String,
        require:true
      },
      email:{
        type:String,
        require:true}
     


});


Product.post("save",async function(doc){
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
          subject: "your product is uploaded in our site",
          html:`<h2>Hello Jee</h2> <p>product Uploaded</p>`,
      })
      
      console.log("INFO", info);
  
  }
  catch(error){
    console.log("mail can't be sent");
  }
  });



module.exports=mongoose.model("Product",Product);