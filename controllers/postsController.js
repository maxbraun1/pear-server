import express from 'express';

import PostModel from '../models/postModel.js';
import UserModel from '../models/userModel.js';
import cloudinary from 'cloudinary';
import fs from 'fs';

const router = express.Router();

export const getPost = async (req,res) => {
    const id = req.body.postID;
    try {
        const post = await PostModel.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deletePost = async (req,res) => {
    const userID = req.user.id;
    const postID = req.body.postID;

    try{
        const result = await PostModel.findOneAndUpdate({ _id: postID, userID: userID },{
            deleted: true
        });
        if(result !== null){
            // Delete Post Image from Cloudinary
            console.log(result.imageID)
            cloudinary.uploader.destroy(result.imageID);
        }
    }catch(err){
        console.log(err)
        res.json({ error: true, errorMessage: err });
    }
}

export const createPost = async (req, res, next) => {
    let userID = req.user.id;
    let timestamp = Date.now();
    let technologies = req.body.technologies;
    technologies = technologies.map(x => x.toLowerCase().replace(/[^A-Za-z0-9]/g,""));
    let title = req.body.title;
    let description = req.body.description;
    let category = req.body.category;
    let likesCount = 0;

    let newPostID = null;


    // Create post in database
    const newPostDoc = new PostModel({
        userID,
        timestamp,
        technologies,
        title,
        description,
        category,
        likesCount,
        deleted: false
    });

    try {
        await newPostDoc.save(function(err,post){
            if(err){
                res.status(404).json({ message: err });
            }else{
                newPostID = post._id;
                UserModel.findByIdAndUpdate(req.user.id, {
                    $push: {
                        posts: [post._id],
                    },
                },function(err,doc){
                    if(err){
                        res.json({error:true, message:err});
                    }else{
                        res.json({error:false,newPostID:newPostID});
                    }
                });
            }
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const addPostImage = async (req, res, next) => {
    const postID = req.body.postID;

    // Add post image to database
    try{
        cloudinary.v2.uploader.upload(req.file.path, { folder: "/posts" }, function (err,result){
            if(err){
                res.json({error:true, message: err})
            }else{
                console.log(result)
                PostModel.findOneAndUpdate({_id: postID},{imageID: result.public_id, imageURL: result.url},function(err, doc){
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

export const getDefaultPosts = async (req,res) => {
    const perPage = 20;
    const skip = (req.body.pageNum - 1) * perPage;

    try {
        let posts = await PostModel.find().sort({'timestamp': 'desc'}).skip(skip).limit(20);
        posts = posts.map(x => x.id)
        res.json(posts);
    } catch (err) {
        res.json({ error: true, errorMessage: err });
    }
}

export const getPostsSortBy = async (req,res) => {
    const perPage = 20;
    const skip = (req.body.pageNum - 1) * perPage;
    const sortBy = req.body.sortBy;

    try {
        let posts;
        if(sortBy == "mostlikes"){
            posts = await PostModel.find().sort({'likesCount': 'desc'}).skip(skip).limit(20);
        }else{
            posts = await PostModel.find().skip(skip).limit(20).distinct('_id');
        }
        posts = posts.map(x => x.id)
        res.json(posts);
    } catch (err) {
        res.json({ error: true, errorMessage: err });
    }
}

export const getPostsSearchTechnology = async (req,res) => {
    const perPage = 20;
    const skip = (req.body.pageNum - 1) * perPage;
    const technology = req.body.technology;

    try {
        let posts = await PostModel.find({ technologies: technology }).skip(skip).limit(20);
        posts = posts.map(x => x.id)
        res.json(posts);
    } catch (err) {
        res.json({ error: true, errorMessage: err });
    }
}


export const getLikedPosts = async (req,res) => {
    const perPage = 20;
    const skip = (req.body.pageNum - 1) * perPage;

    try {
        const currentUser = await UserModel.findById(req.user.id);
        const userLikedPosts = currentUser.likedPosts;
        try {
            let posts = await PostModel.find({'_id': {$in: userLikedPosts}}).skip(skip).limit(20);
            posts = posts.map(x => x.id)
            res.json(posts);
        } catch (err) {
            res.json({ error: true, errorMessage: err });
            console.log(err)
        }
    } catch (err) {
        console.log(err)
        res.json({ error: true, errorMessage: err });
    }
}

export const getPostsByCategory = async (req,res) => {
    const perPage = 20;
    const skip = (req.body.pageNum - 1) * perPage;
    const categoryID = req.body.categoryID;

    try {
        let posts = await PostModel.find({ category: categoryID }).skip(skip).limit(20);
        posts = posts.map(x => x.id)
        res.json(posts);
    } catch (err) {
        res.json({ error: true, errorMessage: err });
    }
}

export const postLikeUnlike = async (req,res) => {
    PostModel.findById(req.body.postID, async function(err, post) {
        if (err) {
            res.err(err);
        }else{
            const alreadyLiked = post.likes.includes(req.body.userID);
            if(alreadyLiked){
                // If post is already like, remove the user from the 'likes' array on the post
                PostModel.updateOne({ _id: req.body.postID }, {
                    $pullAll: {
                        likes: [req.body.userID],
                    },
                    $inc: { likesCount: -1 }
                },function(err,doc){
                    if(err){
                        res.json(err);
                    }else{
                        UserModel.updateOne({_id: req.user.id}, {
                            $pullAll: {
                                likedPosts: [req.body.postID],
                            },
                        },function(err,doc){
                            if(err){
                                res.json(err);
                            }else{
                                res.json(true);
                            }
                        });
                    }
                });
            }else{
                // If post is not already liked, add user to the 'likes' array on the post
                PostModel.updateOne({ _id: req.body.postID }, {
                    $push: {
                        likes: [req.body.userID],
                    },
                    $inc: { 
                        likesCount:1
                    }
                },function(err,doc){
                    if(err){
                        res.json(err);
                    }else{
                        UserModel.updateOne({ _id: req.user.id}, {
                            $push: {
                                likedPosts: [req.body.postID],
                            },
                        },function(err,doc){
                            if(err){
                                console.log(err)
                            }else{
                                res.json(true);
                            }
                        });
                    }
                });
            }
        }
    });
}
export default router;

