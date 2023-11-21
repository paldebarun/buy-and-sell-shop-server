const express=require("express");
const routes=express.Router();

const {signup,uploadProduct,getdata,addtocart,imageUpload,removeFromCart,isPresentInCart,getAllProductsInCart,getProductsByCategory }=require('../controllers/handlers');


routes.post("/signup",signup);

routes.post("/uploadProducts",uploadProduct);

routes.post('/data',getdata);

routes.post('/addtocart',addtocart);

routes.post('/uploadImage',imageUpload);

routes.post('/removefromcart',removeFromCart);

routes.post('/ispresentincart',isPresentInCart);

routes.post('/fetchcartproducts',getAllProductsInCart);

routes.post('/fetchbycategory',getProductsByCategory);



module.exports=routes;