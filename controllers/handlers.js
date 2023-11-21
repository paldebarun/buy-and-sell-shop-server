const User = require('../models/user');
const bcrypt = require('bcrypt');

const Product = require('../models/product');
const Cart = require('../models/cart');
const File=require('../models/File');

const cloudinary = require("cloudinary").v2;


require('dotenv').config();



exports.signup = async (req, res) => {
   try {
      const { id,userName,firstName, lastName, email, phone } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
         return res.status(200).json(
            {
               success: true,
               message: "user already present"
            }
         );
      }
      

      const cart=await Cart.create({
           products:[]
      })

      const newUser = await User.create({
         id,
         userName,
         lastName,
         firstName,
         email,
         phone,
         cart:cart._id

      });

      return res.status(200).json(
         {
            success: true,
            message: "user registered successfully",
            user:newUser
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

      const { user, title, description,  image, price, category } = req.body;

      console.log("this is user : ",typeof user);

      if (!user || !title || !description || !price  || !category) {
         return res.status(400).json({
            success: false,
            message: "enter the informations correctly"
         });
      }
      console.log("the user is ",user); 
      
      const userdata=await User.find({id:user});
      console.log("user data : ",userdata);
       
      // const uploaded = await User.findOne({ email: uploadermail });
      // console.log(uploaded);
      // if (!uploaded) {
      //    return res.status(400).json({
      //       success: false,
      //       message: "the uploader is not registered"
      //    })
      // }

      const newproduct = await Product.create({
         user, title, image, price, description,category,email:userdata.email
      });



      const updatedUser = await User.findOneAndUpdate({ id: user }, {
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
      const { product,user_id } = req.body;
      

       const userdata=await User.findById(user_id);
    

      const updatedCart = await Cart.findByIdAndUpdate({ _id: userdata.cart }, {
         $push: {
            products: product,
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
         
         imageUrl:response.url,
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




exports.removeFromCart = async (req, res) => {
   try {
      const { productId, user_id } = req.body;

      const userdata = await User.findById(user_id);

      const updatedCart = await Cart.findByIdAndUpdate(
         { _id: userdata.cart },
         {
            $pull: {
               products: { _id: productId },
            },
         },
         { new: true }
      );

      return res.status(200).json({
         success: true,
         message: "Item removed from cart successfully",
         updatedCart,
      });

   } catch (error) {
      console.log(error);
      return res.status(400).json({
         success: false,
         message: "Item not removed from cart due to some error",
      });
   }
};



exports.isPresentInCart = async (req, res) => {
   try {
      const { productId, user_id } = req.body;

      const userdata = await User.findById(user_id);

      const cart = await Cart.findOne({ _id: userdata.cart });

      if (!cart) {
         return res.status(404).json({
            success: false,
            message: "Cart not found",
         });
      }

      const productExists = cart.products.some(
         (product) => product._id.toString() === productId
      );
      
      return res.status(200).json({
         success: true,
         message: productExists
            ? "Product is present in the cart"
            : "Product is not present in the cart",
         productExists,
      });

   } catch (error) {
      console.log(error);
      return res.status(400).json({
         success: false,
         message: "Error while checking product in cart",
      });
   }
};

exports.getAllProductsInCart = async (req, res) => {
   try {
      const { user_id } = req.body;

      const userdata = await User.findById(user_id);

      const cart = await Cart.findOne({ _id: userdata.cart });

      if (!cart) {
         return res.status(404).json({
            success: false,
            message: "Cart not found",
         });
      }

      
      const productIds = cart.products;

      
      const productsInCart = await Product.find({ _id: { $in: productIds } });

      return res.status(200).json({
         success: true,
         message: "Products fetched successfully",
         products: productsInCart,
      });

   } catch (error) {
      console.log(error);
      return res.status(400).json({
         success: false,
         message: "Error while fetching products in cart",
      });
   }
};

exports.getProductsByCategory = async (req, res) => {
   try {
     const { category } = req.body; 
 
     const products = await Product.find({ category });
 
     if (!products || products.length === 0) {
       return res.status(404).json({
         success: false,
         message: "No products found for the given category",
         products: [],
       });
     }
 
     return res.status(200).json({
       success: true,
       message: "Products found for the given category",
       products,
     });
   } catch (error) {
     console.error(error);
     return res.status(500).json({
       success: false,
       message: "Error while fetching products by category",
     });
   }
 };
 


 

