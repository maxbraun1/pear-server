import express from "express"
import UserModel from "../models/userModel.js";
import { loggedIn } from "../middleware/loggedIn.js";
import { updatePersonalInfoRules } from "../middleware/updatePersonalInfoRules.js";
import { validateRules } from "../middleware/validateRules.js";
import { updateProfileBacksplash, updateProfilePicture } from "../controllers/userController.js";
import multer from 'multer';

const router = express.Router()

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

router.post('/updateProfileBacksplash', loggedIn, upload.single('profileBacksplash'), updateProfileBacksplash);

router.post('/updateProfilePicture', loggedIn, upload.single('profilePicture'), updateProfilePicture);

router.post('/user', (req,res)=>{
    if(req.body.userID != null){
        UserModel.findById(req.body.userID, async function(err, user) {
            if (err) {
                res.json(err);
            }else{
                const userInfo = {
                    firstName: user.firstName,
                    lastName: user.lastName.charAt(0).toUpperCase() + ".",
                    profilePicture: user.profilePicture
                }
                res.json(userInfo);
            }
        });
    }
});

router.post('/public', (req,res)=>{
    let userID = req.body.userID;
    UserModel.findById(userID, async function(err, user) {
        if (err) {
            res.json(false);
        }else{
            const userInfo = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                bio: user.bio,
                profilePicture: user.profilePicture,
                profileBacksplash: user.profileBacksplash,
                accountDate: user.accountCreationTimestamp,
                options: user.options,
                posts: user.posts,
                likedPosts: user.likedPosts,
                postCount: user.posts.length,
                likedCount: user.likedPosts.length
            }
            res.json(userInfo);
        }
    });
});

router.get('/', loggedIn, (req,res)=>{
    UserModel.findById(req.user.id, async function(err, user) {
        if (err) {
            res.json(false);
        }else{
            const userInfo = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                bio: user.bio,
                profilePicture: user.profilePicture,
                profileBacksplash: user.profileBacksplash,
                accountDate: user.accountCreationTimestamp,
                options: user.options,
                posts: user.posts,
                likedPosts: user.likedPosts,
                postCount: user.posts.length,
                likedCount: user.likedPosts.length
            }
            res.json(userInfo);
        }
    });
});


router.get('/getPersonalSettings', loggedIn, (req,res)=>{
    let userID = req.user.id;

    UserModel.findById(userID, function(err, user){
        if (err) {
            console.log(err)
            res.json(false);
        }else{
            const userInfo = {
                firstName: user.firstName,
                lastName: user.lastName,
                bio: user.bio,
            }
            res.json(userInfo);
        }
    });
});

router.post('/updatePersonalSettings', loggedIn, updatePersonalInfoRules, validateRules, async (req,res)=>{
    let userID = req.user.id;
    const updates = { firstName: req.body.firstName, lastName: req.body.lastName, bio: req.body.bio }

    UserModel.findOneAndUpdate({ _id : userID }, updates, function(err){
        if(err){
            res.json({ result: false} );
        }else{
            res.json({ result: true });
        }
    });
    
});

export default router