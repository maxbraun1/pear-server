import express from 'express';
import UserModel from "../models/userModel.js";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";
import fs from 'fs';

const router = express.Router();

export const createUser = async (req, res, next) => {
    // check if email or username exists already
    let userEmail = await UserModel.exists({ email: req.body.email })
    let userUsername = await UserModel.exists({ username: req.body.username })

    if (userEmail) {
        res.status(200).json({
            "errors": [{"msg": "Email already registered."}]
        })
    } else if (userUsername) {
        res.status(200).json({
            "errors": [{"msg": "Username Taken"}]
        })
    } else {
        // Hash Password

        let HashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create user in database
        const newUser = req.body;
        const newUserDoc = new UserModel({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            username: newUser.username,
            email: newUser.email,
            profilePicture: null,
            accountCreationTimestamp: Date.now(),
            nativeAccount: true,
            password: HashedPassword
        })

        try {
            await newUserDoc.save(function(err,user){
                if(err){
                    res.status(404).json({ message: err });
                }else{
                    next();
                }
            });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }

    }
}


export const updateProfileBacksplash = async (req, res) => {

    try{
        cloudinary.v2.uploader.upload(req.file.path, { folder: "/profileBacksplash" }, function (err,result){
            if(err){
                res.json({error:true, message: err})
            }else{
                UserModel.findOneAndUpdate({_id: req.user.id},{profileBacksplash: result.url, profileBacksplashID: result.public_id},function(err, doc){
                    if(err){
                        res.json({error:true, message:err})
                        console.log(err)
                    }else{
                        res.json({error:false})
                    }
                })
            }
        });
    }catch(err){
        res.json({error:true, message: err})
    }

    // Delete temp image

    fs.unlink(req.file.path , (err) => {
        if (err) {
            console.log(err)
            throw err;
        }
    });

}

export const updateProfilePicture = async (req, res) => {

    try{
        cloudinary.v2.uploader.upload(req.file.path, { folder: "/profilePicture" }, function (err,result){
            if(err){
                res.json({error:true, message: err})
            }else{
                UserModel.findOneAndUpdate({_id: req.user.id},{profilePicture: result.url, profilePicutreID: result.public_id},function(err, doc){
                    if(err){
                        res.json({error:true, message:err})
                        console.log(err)
                    }else{
                        res.json({error:false})
                    }
                })
            }
        });
    }catch(err){
        res.json({error:true, message: err})
    }

    // Delete temp image

    fs.unlink(req.file.path , (err) => {
        if (err) {
            console.log(err)
            throw err;
        }
    });

}

export default router;