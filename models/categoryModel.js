import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    color: {
        type: String,
    }
})

const CategoryModel = mongoose.model("categories", categorySchema)
export default CategoryModel