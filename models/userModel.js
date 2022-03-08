import { ObjectId } from "mongodb"
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    profilePicture: {
        type: String
    },
    profilePictureID: {
        type: String
    },
    profileBacksplash: {
        type: String
    },
    profileBacksplashID: {
        type: String
    },
    accountCreationTimestamp: {
        type: Date,
        required: true
    },
    nativeAccount: {
        type: Boolean,
        required: true
    },
    password: {
        type: String,
    },
    skillsMaster: [String],
    skillsIntermediate: [String],
    skillsNovice: [String],
    skillsWTL: [String],
    options: [String],
    posts: [ObjectId],
    likedPosts: [String],
    requests: [String],
    invites: [String]
})

const UserModel = mongoose.model("users", userSchema)
export default UserModel