import { ObjectId } from "mongodb"
import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    userID: {
        type: ObjectId,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    technologies: [String],
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    likesCount: {
        type: Number
    },
    likes: [ObjectId],
    category: {
        type: ObjectId,
        required: true
    },
    imageID: {
        type: String
    },
    imageURL: {
        type: String
    },
    deleted: {
        type: Boolean
    }
})

const PostModel = mongoose.model("posts", postSchema)
export default PostModel