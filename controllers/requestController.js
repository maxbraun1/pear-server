import express, { request } from 'express';
import UserModel from "../models/userModel.js";
import PostModel from "../models/postModel.js";
import RequestModel from "../models/requestModel.js";

const router = express.Router();

export const createRequest = async (req, res) => {
    const postID = req.body.postID;
    const message = req.body.message;
    const fromUser = req.user.id;

    // Check if duplicate
    RequestModel.find({
        postID: postID,
        fromUser: fromUser,
    }, function(err, doc){
        if(doc.length != 0){
            res.json({error: true, message: "You have already requested to join!"});
        }else{
            // if not, Create Request
            PostModel.findById(postID, function(err,post){
                if(err){
                    res.json({ error: true, message: err.message });
                }else{
                    const toUser = post.userID;
                    const newRequest = new RequestModel({
                        postID,
                        fromUser,
                        toUser,
                        message,
                        requestTimestamp: Date.now(),
                        status: "pending"
                    });

                    newRequest.save(function(err){
                        if(err){
                            res.json({ error: true, message: err.message });
                        }else{
                            res.json({error: false})
                        }
                    });
                } 
            });
        }
    })
}

export const checkRequest = async (req, res) => {
    const postID = req.body.postID;
    const fromUser = req.user.id;

    // Check if duplicate
    RequestModel.find({
        postID: postID,
        fromUser: fromUser,
    }, function(err, doc){
        if(doc.length != 0){
            res.json(true);
        }else{
            res.json(false);
        }
    })
}

export const answerRequest = async (req, res) => {
    const requestID = req.body.requestID;
    const user = req.user.id;
    
    let answer;
    if(req.body.answer == "accept"){
        answer = "accepted"
    }else if(req.body.answer == "decline"){
        answer = "declined"
    }else{
        answer = "pending"
    }

    console.log(requestID)
    console.log(user);

    RequestModel.updateOne({_id: requestID,toUser: user},
        { status: answer },
        function(err, doc){
        if(err){
            res.json({error:true, message: err});
        }else{
            res.json({error:false});
        }
    })
}

export const getUserRequests = async (req, res) => {
    const userID = req.user.id;

    try{
        const requests = await RequestModel.find({toUser: userID}).sort({'requestTimestamp': 'desc'});

        let requestsArray = await Promise.all(requests.map( async (request) => {
            const user = await UserModel.findById(request.fromUser)
            const post = await PostModel.findById(request.postID)

            //fix post title if post is deleted
            let postTitle;
            if(post == null){
                postTitle = "[Deleted]";
            }else{
                postTitle = post.title;
            }

            let fromUserEmail
            if(request.status == "accepted"){
                fromUserEmail = user.email;
            }else{
                fromUserEmail = null;
            }
            return {
                requestID : request._id,
                fromUser : request.fromUser,
                message : request.message,
                requestTimestamp : request.requestTimestamp,
                status : request.status,
                profilePicture : user.profilePicture,
                firstName : user.firstName,
                lastName : user.lastName,
                postTitle : postTitle,
                postID: request.postID,
                fromUserEmail
            }
        }));
        res.json(requestsArray)
    }catch(err){
        console.log(err)
        res.json({ err:true, message:err })
    }
}

export default router;