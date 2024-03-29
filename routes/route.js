const express=require("express");
const routes=express.Router();

const {signup,uploadProduct,getdata,addtocart,imageUpload,removeFromCart,isPresentInCart,getAllProductsInCart,getProductsByCategory,profileinfonames,getProfileInfoNames,submitEmail,getEmailData,addAddress,addOrUpdatePancard,capturePayment,verifyPayment,getorderdata,clearCart }=require('../controllers/handlers');


routes.post("/signup",signup);

routes.post("/uploadProducts",uploadProduct);

routes.post('/data',getdata);

routes.post('/addtocart',addtocart);

routes.post('/uploadImage',imageUpload);

routes.post('/removefromcart',removeFromCart);

routes.post('/ispresentincart',isPresentInCart);

routes.post('/fetchcartproducts',getAllProductsInCart);

routes.post('/fetchbycategory',getProductsByCategory);

routes.post('/saveprofileinfoname',profileinfonames);

routes.post('/getprofileinfonames',getProfileInfoNames);

routes.post('/submitemail',submitEmail);

routes.post('/getemaildata',getEmailData);

routes.post('/addAddress',addAddress);

routes.post('/addpancard',addOrUpdatePancard);

routes.post('/capturepayment',capturePayment);

routes.post('/verifypayment',verifyPayment);

routes.post('/fetchorders',getorderdata);

routes.post('/erasecart',clearCart);


module.exports=routes;