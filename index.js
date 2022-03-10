import express from "express";
import cloudinary from "cloudinary";
import bodyParser from "express";
import mongoose from "mongoose";
import postRouter from "./routes/postsRouter.js";
import userRouter from "./routes/userRouter.js";
import requestRouter from "./routes/requestRouter.js";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import "./middleware/googleAuth.js";
import "./middleware/localAuth.js";
import cookieSession from "cookie-session";
import authRouter from "./routes/authRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import { sendMessage } from "./controllers/messageController.js";

const app = express();

app.use(express.json());

if(process.env.PROD == 1){
    var origin = 'https://pearprogramming.co'
}else{
    var origin = 'http://localhost:3000'
}
const corsOptions ={
    origin:origin,
    credentials:true,
    optionSuccessStatus:200,
}
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));

// initialize cloudinary
cloudinary.config({ 
    cloud_name: 'pear-programming', 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET 
});

// initialize passport and cookies
var cookieOptions;
if(process.env.PROD == 1){
    app.set('trust proxy', 1)
    cookieOptions = {
        name: "pear-session",
        keys: [process.env.SESSION_KEY],
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: true,
        httpOnly: true,
        sameSite: 'none'
    }
}else{
    cookieOptions = {
        name: "pear-session",
        keys: [process.env.SESSION_KEY],
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
}

app.use(
    cookieSession(cookieOptions)
);
app.use(passport.initialize());
app.use(passport.session());

const uri = process.env.MONGO_URI;

mongoose.connect(uri);

app.use("/posts", postRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/categories", categoryRouter);
app.use("/requests", requestRouter);
app.post("/message", sendMessage)

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running`);
});

if(process.env.PROD == 1){
    console.log("server is in production mode")
}else{
    console.log("server is in development mode")
}
