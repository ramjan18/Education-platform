const express = require("express");
const app = express();
const database = require('./config/database');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connectCloudinary } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const userRoute = require("./routes/User");
const profileRoute = require("./routes/profile");
const courseRoute = require("./routes/Course");

require('dotenv').config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));
app.use(
    fileUpload({
        useTempFiles :true,
        tempFileDir:"/temp"
    })
)

//cloudinary connect
connectCloudinary();
//database connection
database.connect();

PORT=process.env.PORT || 4000

app.use('/api/v1/auth',userRoute);
app.use("/api/v1/profile",profileRoute);
app.use("/api/v1/course",courseRoute);


app.get('/',(req,res)=>{
    console.log("App is Started")
    res.send("App is Started")
})


app.listen(PORT,()=>{
    console.log(`App is listening on ${PORT}`);
})