const User = require('../models/user');
const bcrypt = require('bcrypt');

const Product = require('../models/product');
const Cart = require('../models/cart');
const File=require('../models/File');
const cloudinary = require("cloudinary").v2;


require('dotenv').config();



exports.signup = async (req, res) => {
   try {
      const { firstName, lastName, email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
         return res.status(400).json(
            {
               success: false,
               message: "user already present"
            }
         );
      }
      let hashedpassword;

      try {
         hashedpassword = await bcrypt.hash(password, 10);

      }
      catch (error) {
         return res.status(400).json({
            success: false,
            message: "hashing of the password was not successful"
         })
      }

      const newUser = await User.create({
         lastName,
         firstName,
         email,
         password: hashedpassword,

      });

      return res.status(200).json(
         {
            success: true,
            message: "user registered successfully",
         }
      );


   }

   catch (error) {
      console.error();
      return res.status(400).json({
         success: false,
         message: "User can't be registered due to some error"
      });
   }

}




exports.uploadProduct = async (req, res) => {
   try {

      const { name, info, imageUrl, price, sellerName, email } = req.body;

      if (!name || !info || !imageUrl || !price || !sellerName || !email) {
         return res.status(400).json({
            success: false,
            message: "enter the informations correctly"
         });
      }

      const uploadermail = "paldebarun27@gmail.com";

      const uploaded = await User.findOne({ email: uploadermail });
      console.log(uploaded);
      if (!uploaded) {
         return res.status(400).json({
            success: false,
            message: "the uploader is not registered"
         })
      }

      const newproduct = await Product.create({
         name, info, imageUrl, price, sellerName, email, uploader: uploaded._id
      });



      const updatedUser = await User.findByIdAndUpdate({ _id: uploaded._id }, {
         $push: {
            products: newproduct._id,
         },
      },
         { new: true });


      return res.status(200).json({
         success: true,
         message: "the product is uploaded successfully",
         updatedUser
      })


   }
   catch (error) {
      console.log(error);
      return res.status(400).json({
         success: false,
         message: "the product can't be uploaded"
      });
   }

}


exports.getdata = async (req, res) => {

   try {
      const data = await Product.find();

      return res.status(200).json({
         success: true,
         message: "data is fetched successfully",
         data
      })
   }
   catch (error) {
      console.log(error);
      return res.status(400).json({
         success: false,
         message: "the data can't be fetched"
      })
   }

}

exports.addtocart = async (req, res) => {
   try {
      const { product } = req.body;
      const userMail = "paldebarun27@gmail.com";
      const user = await User.findOne({ email: userMail });
      console.log(product);
      if (!user) {
         return res.status(400).json({
            success: false,
            message: "you are not registered to add an item to the cart"
         })
      }
      if (!user.cart) {
         const cart = await Cart.create({
            firstName: user.firstName,
            lastName: user.lastName,
            products: [product._id]

         });



         const updatedUser = await User.findByIdAndUpdate({ _id: user._id }, { cart: cart._id }, { new: true });

         return res.status(200).json({
            success: true,
            message: "item added to cart successfully",
            updatedUser
         });

      }

      const updatedCart = await Cart.findByIdAndUpdate({ _id: user.cart }, {
         $push: {
            products: product._id,
         },
      },
         { new: true });

      return res.status(200).json({
         success: true,
         message: "item added to cart successfully",
         updatedCart
      });

   }
   catch (error) {

      console.log(error);

      return res.status(400).json({
         success: false,
         message: "item not added to cart due to some error",

      });


   }


}



function isFileTypeSupported(type, supportedTypes) {
   return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder, quality) {
   const options = {folder};
   console.log("temp file path", file.tempFilePath);

   if(quality) {
       options.quality = quality;
   }

   options.resource_type = "auto";
   return await cloudinary.uploader.upload(file.tempFilePath, options);
}


exports.imageUpload=async (req,res)=>{

   try{
   console.log("this is upload");
   const file = req.files.imageFile;
    console.log("this is file",file);
    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = file.name.split('.')[1].toLowerCase();
    console.log("File Type:", fileType);

    if(!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
          success:false,
          message:'File format not supported',
      })
  }

        console.log(" Uploading ");
        const response = await uploadFileToCloudinary(file, "debarun");
        console.log(response);

        const fileData = await File.create({
         
         imageUrl:response.secure_url,
     });


        return res.json({
         success:true,
         imageUrl:response.secure_url,
         message:'Image Successfully Uploaded',
     });
   }
   catch(error){
      console.error(error);
      res.status(400).json({
          success:false,
          message:'Something went wrong while uploading the file',
      });
   }
}




