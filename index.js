const express=require('express');
const app=express();

require('dotenv').config();
const fileupload = require("express-fileupload");

app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());

const PORT=process.env.PORT || 4000;

const {databaseConnect}=require('./config/database');
databaseConnect();



const routes = require("./routes/route");
app.use("/api/v1", routes);





app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
})