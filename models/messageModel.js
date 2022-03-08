import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    messageTimestamp: {
        type: Date,
        required: true
    }
})

const MessageModel = mongoose.model("messages", messageSchema)
export default MessageModel