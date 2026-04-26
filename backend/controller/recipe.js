const Recipes=require("../models/recipe")
const multer  = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/images")
    },
    filename: function (req, file, cb) {
      const filename = Date.now() + "-" + file.fieldname
      cb(null, filename)
    }
  })
  
  const upload = multer({ storage: storage })

const getRecipes=async(req,res)=>{
    try{
        const recipes=await Recipes.find().populate("category").populate("createdBy","email")
        return res.json(recipes)
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

const getRecipesByUser=async(req,res)=>{
    try{
        const recipes=await Recipes.find({createdBy:req.params.userId}).populate("category").populate("createdBy","email")
        res.json(recipes)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

const getRecipe=async(req,res)=>{
    try{
        const recipe=await Recipes.findById(req.params.id).populate("category").populate("createdBy","email")
        if(!recipe){
            return res.status(404).json({message:"Recipe not found"})
        }
        res.json(recipe)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

const addRecipe=async(req,res)=>{
    const {title,ingredients,instructions,time,category}=req.body 

    if(!title || !ingredients || !instructions || !time || !category)
    {
        return res.status(400).json({message:"Required fields can't be empty"})}

    if(!req.file){
        return res.status(400).json({message:"Recipe image is required"})
    }

    try{
        const newRecipe=await Recipes.create({
            title,ingredients,instructions,time,category,coverImage:req.file.filename,
            createdBy:req.user.id
        })
       return res.status(201).json(newRecipe)
    }catch(err){
        return res.status(400).json({message:err.message})
    }
}

const editRecipe=async(req,res)=>{
    const {title,ingredients,instructions,time,category}=req.body 
    try{
        let recipe=await Recipes.findById(req.params.id)
        if(!recipe){
            return res.status(404).json({message:"Recipe not found"})
        }
        let coverImage=req.file?.filename ? req.file?.filename : recipe.coverImage
        await Recipes.findByIdAndUpdate(req.params.id,{...req.body,coverImage},{new:true})
        res.json({message:"Recipe updated"})
    }
    catch(err){
        return res.status(400).json({message:err.message})
    }
    
}
const deleteRecipe=async(req,res)=>{
    try{
        const recipe=await Recipes.findByIdAndDelete(req.params.id)
        if(!recipe){
            return res.status(404).json({message:"Recipe not found"})
        }
        res.json({status:"ok"})
    }
    catch(err){
        return res.status(400).json({message:"error"})
    }
}
/* ❗ The exact problem

You have this line:

module.exports={getRecipes,getRecipe,getRecipesByUser,getRecipeStats,addRecipe,editRecipe,deleteRecipe,upload}

BUT your function:

const getRecipeStats = async (req,res) => { ... }

is written AFTER exports ❌

👉 In JavaScript, const functions are NOT hoisted, so Node crashes.
module.exports={getRecipes,getRecipe,getRecipesByUser,getRecipeStats,addRecipe,editRecipe,deleteRecipe,upload}
const getRecipeStats=async(req,res)=>{
    try{
        const totalRecipes = await Recipes.countDocuments()
        const recipesByCategory = await Recipes.aggregate([
            {$group: {_id: "$category", count: {$sum: 1}}}
        ])
        res.json({totalRecipes, recipesByCategory})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}
*/

const getRecipeStats=async(req,res)=>{
    try{
        const totalRecipes = await Recipes.countDocuments()
        const recipesByCategory = await Recipes.aggregate([
            {$group: {_id: "$category", count: {$sum: 1}}}
        ])
        res.json({totalRecipes, recipesByCategory})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}


module.exports={getRecipes,getRecipe,getRecipesByUser,getRecipeStats,addRecipe,editRecipe,deleteRecipe,upload}
