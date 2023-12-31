const User = require('../models/user');
const names=require('../models/profileinfoNames')
const Product = require('../models/product');
const Cart = require('../models/cart');
const File=require('../models/File');
const cloudinary = require("cloudinary").v2;
const Emaildata=require('../models/Emaildata');
const Address = require('../models/Address');
const Pancardinfo=require('../models/Pancardinfo');
const {instance}=require('../config/razorpay');
const mongoose=require('mongoose')
const crypto = require('crypto');

require('dotenv').config();

exports.signup = async (req, res) => {
   try {
      const { id,userName,firstName, lastName, email, phone } = req.body;
      if(!id && !userName && !firstName && !lastName && !email && !phone){
         return res.status(404).json({
            success : false,
            message : "Data not found"
         })
      }
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
      

      const userdata=await User.findOne({id:user_id});
    

      const updatedCart = await Cart.findByIdAndUpdate({ _id: userdata.cart }, {
         $push: {
            products: product,
         },
      },
         { new: true });
       
         console.log("this is updated cart ",updatedCart);

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
 
     // Find the user by their ID
     const user = await User.findOne({ id: user_id });
 
     if (!user) {
       return res.status(404).json({
         success: false,
         message: "User not found"
       });
     }
 
     // Find the cart by its ID
     const cart = await Cart.findById(user.cart);
 
     if (!cart) {
       return res.status(404).json({
         success: false,
         message: "Cart not found"
       });
     }
 
     // Remove the product from the cart
     const updatedCart = cart.products.filter((product) => product._id.toString() !== productId);
 
     // Update the cart in the database
     await Cart.findByIdAndUpdate(cart._id, { products: updatedCart });
 
     return res.status(200).json({
       success: true,
       message: "Product successfully removed from cart",
       removedProduct: { _id: productId } // Assuming you want to return information about the removed product
     });
   } catch (error) {
     console.error(error);
     return res.status(500).json({
       success: false,
       message: "Internal server error"
     });
   }
 };



exports.isPresentInCart = async (req, res) => {
   try {
      const { productId, user_id } = req.body;

      const userdata = await User.findById(user_id);

      const cartdata = await Cart.findOne({ _id: userdata.cart });

      if (!cartdata) {
         return res.status(404).json({
            success: false,
            message: "Cart not found",
         });
      }

      const productExists = cartdata.products.some(
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

      const userdata = await User.findOne({id:user_id});

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
       return res.status(200).json({
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
 


 exports.profileinfonames = async (req, res) => {
   try {
      const { user, firstName, lastName ,gender} = req.body;
      
      
      if (!user || !firstName || !lastName || !gender) {
         return res.status(400).json({
            success: false,
            message: "Required fields are missing",
         });
      }

      
      const existingUser = await User.findOne({ id: user });

      if (!existingUser) {
         return res.status(404).json({
            success: false,
            message: "User not found",
         });
      }

      
      const profileInfo = await names.create({
         user,
         firstName,
         lastName,
         gender
      });

      return res.status(200).json({
         success: true,
         message: "Profile information names saved successfully",
         profileInfo,
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         success: false,
         message: "Internal server error",
      });
   }
};
 


exports.getProfileInfoNames = async (req, res) => {
   try {
      const { user } = req.body;

      
      if (!user) {
         return res.status(400).json({
            success: false,
            message: "User ID is missing",
         });
      }

     
      const existingUser = await User.findOne({ id: user });

      if (!existingUser) {
         return res.status(404).json({
            success: false,
            message: "User not found",
         });
      }

      
      const profileInfo = await names.findOne({ user });

      if (!profileInfo) {
         return res.status(404).json({
            success: false,
            message: "Profile information names not found for the user",
         });
      }

      return res.status(200).json({
         success: true,
         message: "Profile information names retrieved successfully",
         profileInfo,
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         success: false,
         message: "Internal server error",
      });
   }
};

exports.submitEmail = async (req, res) => {
   try {
     const { user, email } = req.body;
 
     if (!user || !email) {
       return res.status(400).json({
         success: false,
         message: "User and email are required fields",
       });
     }
 
     const existingEmailData = await Emaildata.findOne({ user });
 
     if (existingEmailData) {
       return res.status(200).json({
         success: true,
         message: "Email data already present",
         emailData: existingEmailData,
       });
     }
 
     const newEmailData = await Emaildata.create({
       user,
       email,
     });
 
     return res.status(201).json({
       success: true,
       message: "Email data submitted successfully",
       emailData: newEmailData,
     });
   } catch (error) {
     console.error(error);
     return res.status(500).json({
       success: false,
       message: "Internal Server Error",
     });
   }
 };

 exports.getEmailData = async (req, res) => {
   try {
     const { user } = req.body;
 
     if (!user) {
       return res.status(400).json({
         success: false,
         message: "User ID is missing",
       });
     }
 
     const emailData = await Emaildata.findOne({ user });
 
     if (!emailData) {
       return res.status(404).json({
         success: false,
         message: "Email data not found for the user",
       });
     }
 
     return res.status(200).json({
       success: true,
       message: "Email data retrieved successfully",
       emailData,
     });
   } catch (error) {
     console.error(error);
     return res.status(500).json({
       success: false,
       message: "Internal Server Error",
     });
   }
 };

 exports.addAddress = async (req, res) => {
   try {
     const {
       user,
       name,
       mobilenumber,
       pincode,
       locality,
       address,
       city,
       state,
       landmark,
       altphone,
       addresstype,
       latitude,
       longitude
     } = req.body;
 
     
     if (!user || !name || !mobilenumber || !pincode || !locality || !address || !city || !state || !addresstype || !latitude || !longitude) {
       return res.status(400).json({
         success: false,
         message: "Please provide all required information for the address."
       });
     }
 
     
     const newAddress = await Address.create({
       user,
       name,
       mobilenumber,
       pincode,
       locality,
       address,
       city,
       state,
       landmark,
       altphone,
       addresstype,
       latitude,
       longitude
     });
 
     return res.status(201).json({
       success: true,
       message: "Address added successfully",
       address: newAddress
     });
   } catch (error) {
     console.error(error);
     return res.status(500).json({
       success: false,
       message: "Internal Server Error"
     });
   }
 };
 
 exports.addOrUpdatePancard = async (req, res) => {
   try {
      const { user, number, fullname, imageUrl, aggreement } = req.body;

      if (!user || !number || !fullname || !imageUrl || !aggreement) {
         return res.status(400).json({
            success: false,
            message: "Required fields are missing",
         });
      }

      let pancard = await Pancardinfo.findOne({ user });

      if (!pancard) {
         
         pancard = await Pancardinfo.create({
            user,
            number,
            fullname,
            imageUrl,
            aggreement
         });

         return res.status(201).json({
            success: true,
            message: "Pancard details added successfully",
            pancard,
         });
      }

     
      pancard = await Pancardinfo.findOneAndUpdate(
         { user },
         { number, fullname, imageUrl, aggreement },
         { new: true }
      );

      return res.status(200).json({
         success: true,
         message: "Pancard details updated successfully",
         pancard,
      });

   } catch (error) {
      console.error(error);
      return res.status(500).json({
         success: false,
         message: "Internal server error",
      });
   }
};


exports.capturePayment=async (req,res)=>{



    const {products}=req.body;

    if(products.length===0){
      return res.json({success:false, message:"Please provide product Id"});
    }

    let totalAmount = 0;

    for(const productId of products) {
      let product;
      try{

         
          product = await Product.find({_id:productId._id});
          if(!product) {
              return res.status(200).json({success:false, message:"Could not find the product"});
          }
          console.log("product : ",product);
         
          
         
          console.log("this is product price : ",product[0].price);
          totalAmount += (product[0].price)/100;

          console.log("totalamount : ",totalAmount);
          
      }
      catch(error) {
          console.log(error);
          return res.status(500).json({success:false, message:error.message});
      }   
  }

  const currency = "INR";

    const options = {
        amount: totalAmount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
    }
    
    try{
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success:true,
            message:paymentResponse,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({success:false, mesage:"Could not Initiate Order"});
    }

}


exports.verifyPayment = async(req, res) => {
   const razorpay_order_id = req.body?.razorpay_order_id;
   const razorpay_payment_id = req.body?.razorpay_payment_id;
   const razorpay_signature = req.body?.razorpay_signature;
   const {products,user} = req.body;

   console.log("this is razor pay order id",razorpay_order_id);
   console.log("this is razor pay payment id",razorpay_payment_id);
   console.log("this is razor pay signature",razorpay_signature);
   console.log("this is product  ",products);
   console.log("this is user  ",user);
  

   if(!razorpay_order_id ||
       !razorpay_payment_id ||
       !razorpay_signature || !products || !user) {
           return res.status(200).json({success:false, message:"Payment Failed,attribute missing"});
   }
   

   let body = razorpay_order_id + "|" + razorpay_payment_id;
   const expectedSignature = crypto
       .createHmac("sha256", process.env.RAZORPAY_SECRET)
       .update(body.toString())
       .digest("hex");

       

      //  console.log("this is expected signature",expectedSignature);
      //  console.log("this is razorpay_signature",razorpay_signature);

       if(expectedSignature === razorpay_signature) {
           
           await enrollorder(products, user.id, res);
           
           return res.status(200).json({success:true, message:"Payment Verified"});
       }
       return res.status(200).json({success:"false", message:"Payment Failed"});

}

const enrollorder = async(products, user, res) => {

   if(!products || !user) {
       return res.status(400).json({success:false,message:"Please Provide data for products or UserId"});
   }

   for(const productId of products) {
       try{
         
           
       const enrolledorder = await Product.findOneAndUpdate(
           {_id:productId._id},
           {$push:{users:user}},
           {new:true},
       )

       if(!enrolledorder) {
           return res.status(500).json({success:false,message:"product not Found"});
       }

       //find the student and add the course to their list of enrolledCOurses
       const enrolledorders = await User.findOneAndUpdate({id:user},
           {$push:{
               products: productId,
           }},{new:true});
           
       ///bachhe ko mail send kardo
      //  const emailResponse = await mailSender(
      //      enrollStudents.email,
      //      `Successfully Enrolled into ${enrolledCourse.courseName}`,
      //      courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
      //  )    
       //console.log("Email Sent Successfully", emailResponse.response);
       }
       catch(error) {
           console.log(error);
           return res.status(500).json({success:false, message:error.message});
       }
   }

}


exports.getorderdata=async (req,res)=>{

   try{

      const {user}=req.body;

      const userdata=await User.findOne({id:user});

      if(!userdata){
         return res.json({
            success:false,
            message:"the user is not found"
         });
      }

      

      const products=userdata.products;
      
      let productarray = [];  

        for (let productId of products) {
            try {
                const productdetails = await Product.findById(productId);
                if (productdetails) {
                    productarray.push(productdetails);
                }
            } catch (error) {
                console.error(`Error fetching product ${productId}:`, error);
            }
        }




      return res.status(200).json({
         success:true,
         message:"the orders are fetched",
         orderarray:productarray
      })



   }
   catch(error){


      return res.status(500).json({
         success:false,
         mesage:"the there was some error",
         error:error
      })

   }

}

