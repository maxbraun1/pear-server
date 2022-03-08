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
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,
    optionSuccessStatus:200,
}
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
    cookieSession({
        name: "session",
        keys: [process.env.SESSION_KEY],
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
);

// initialize cloudinary
cloudinary.config({ 
    cloud_name: 'pear-programming', 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET 
});

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT;

const uri = process.env.MONGO_URI;

mongoose.connect(uri);

app.use("/posts", postRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/categories", categoryRouter);
app.use("/requests", requestRouter);
app.post("/message", sendMessage)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
