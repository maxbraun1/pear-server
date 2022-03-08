import express from "express";
import { getPost, createPost, postLikeUnlike, getDefaultPosts, getLikedPosts, getPostsSortBy, getPostsSearchTechnology, getPostsByCategory, deletePost, addPostImage } from '../controllers/postsController.js';
import { loggedIn } from "../middleware/loggedIn.js";
import { createPostRules } from '../middleware/createPostRules.js';
import { createPostValidate } from '../middleware/createPostValidate.js';
import multer from 'multer';

const router = express.Router()

router.post("/post", getPost)

router.post("/like", loggedIn, postLikeUnlike);

router.post("/delete", loggedIn, deletePost);

// Requests for getting posts

router.post("/default", getDefaultPosts);
router.post("/liked", loggedIn, getLikedPosts);
router.post("/sort", getPostsSortBy);
router.post("/search", getPostsSearchTechnology);
router.post("/category", getPostsByCategory);


// Create Post

const storage = multer.diskStorage({
    destination: "./temp_files/",
    filename: function(req, file, cb){
       cb(null,"IMAGE-" + Date.now() + file.originalname);
    }
 });

const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only PNG, JPG, and JPEG formats allowed...'));
        }
    },
    onError : function(err, next) {
        console.log('error: ', err);
        //next(err);
    }
})

router.post("/", loggedIn, createPostRules, createPostValidate, createPost);

router.post("/addImage", loggedIn, upload.single('postImage'), addPostImage);

export default router