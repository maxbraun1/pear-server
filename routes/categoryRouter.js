import express from "express"
import CategoryModel from "../models/categoryModel.js"

const router = express.Router()

router.post("/", (req,res) => {
    CategoryModel.findById(req.body.categoryID, async function(err, category) {
        if (err) {
            res.err(err);
        }else{
            const categoryInfo = {
                name: category.name,
                color: category.color
            }
            res.json(categoryInfo);
        }
    });
});

router.get("/", async (req,res) => {
    try {
        const categories = await CategoryModel.find();  
        res.status(200).json(categories);
    } catch (error) {
        res.json({ message: error.message });
    }
})

export default router