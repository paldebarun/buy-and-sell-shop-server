const express=require("express");
const routes=express.Router();

const {signup,uploadProduct,getdata,addtocart,imageUpload}=require('../controllers/handlers');


routes.post("/signup",signup);


routes.post("/uploadProducts",uploadProduct);
routes.get('/data',getdata);

routes.post('/addtocart',addtocart);

routes.post('/uploadImage',imageUpload);





module.exports=routes;