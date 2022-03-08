import { ObjectId } from "mongodb"
import mongoose from "mongoose"

const requestSchema = new mongoose.Schema({
    postID: {
        type: ObjectId,
        required: true
    },
    fromUser: {
        type: ObjectId,
        required: true
    },
    toUser: {
        type: ObjectId,
        required: true
    },
    message: {
        type: String
    },
    requestTimestamp: {
        type: Date,
        required: true
    },
    status: {
        type: String
    }
})

const RequestModel = mongoose.model("requests", requestSchema)
export default RequestModel