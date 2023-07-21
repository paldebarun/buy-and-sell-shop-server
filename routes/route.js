const express=require("express");
const routes=express.Router();

const {signup,login,uploadProduct,getdata,addtocart,imageUpload,generateotp,checkOtp}=require('../controllers/handlers');


routes.post("/signup",signup);
routes.post("/login", login);

routes.post("/uploadProducts",uploadProduct);
routes.get('/data',getdata);

routes.post('/addtocart',addtocart);

routes.post('/uploadImage',imageUpload);

routes.post('/sendOtp',generateotp);
routes.get('/checkotp',checkOtp);



module.exports=routes;