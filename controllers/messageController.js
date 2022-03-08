import express from 'express';
import MessageModel from '../models/messageModel.js';

const router = express.Router();

export const sendMessage = async (req,res) => {
    const newMessage = req.body;
    if(newMessage.name && newMessage.email && newMessage.message){
        const newMessageDoc = new MessageModel({
            name: newMessage.name,
            email: newMessage.email,
            message: newMessage.message,
            messageTimestamp: Date.now()
        })

        await newMessageDoc.save(function(err,message){
            if(err){
                res.json({ error: true, message: err });
            }else{
                res.json({error: false});
            }
        });
    }else{
        res.json({ error: true, message: 'Please fill out all fields.'})
    }
        
}

export default router;