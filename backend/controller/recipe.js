const fs = require("fs")
const path = require("path")
const multer = require("multer")
const Recipes = require("../models/recipe")
const User = require("../models/user")

const imageDir = path.join(__dirname, "../public/images")
fs.mkdirSync(imageDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDir)
  },
  filename: (req, file, cb) => {
    const safeOriginalName = file.originalname.replace(/\s+/g, "-")
    cb(null, `${Date.now()}-${safeOriginalName}`)
  }
})

const upload = multer({ storage })

const populateRecipe = (query) => query.populate("category").populate("createdBy", "email")

const normalizeIngredients = (ingredients) => {
  if (Array.isArray(ingredients)) {
    return ingredients.map(item => String(item).trim()).filter(Boolean)
  }

  if (typeof ingredients === "string") {
    return ingredients.split(",").map(item => item.trim()).filter(Boolean)
  }

  return []
}

const ownsRecipe = (recipe, userId) => {
  return recipe.createdBy && recipe.createdBy.toString() === userId
}

const getRecipes = async (req, res) => {
  try {
    const recipes = await populateRecipe(Recipes.find().sort({ createdAt: -1 }))
    return res.json(recipes)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getRecipesByUser = async (req, res) => {
  if (req.params.userId && req.params.userId !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" })
  }

  try {
    const recipes = await populateRecipe(
      Recipes.find({ createdBy: req.user.id }).sort({ createdAt: -1 })
    )
    return res.json(recipes)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getRecipe = async (req, res) => {
  try {
    const recipe = await populateRecipe(Recipes.findById(req.params.id)) 
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    return res.json(recipe)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const addRecipe = async (req, res) => {
  const { title, instructions, time, category } = req.body
  const ingredients = normalizeIngredients(req.body.ingredients)

  if (!title || !instructions || !time || !category || ingredients.length === 0) {
    return res.status(400).json({ message: "Required fields can't be empty" })
  }

  if (!req.file) {
    return res.status(400).json({ message: "Recipe image is required" })
  }

  try {
    const newRecipe = await Recipes.create({
      title: title.trim(),
      ingredients,
      instructions: instructions.trim(),
      time: time.trim(),
      category,
      coverImage: req.file.filename,
      createdBy: req.user.id
    })

    return res.status(201).json(newRecipe)
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
}

const editRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id)
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    if (!ownsRecipe(recipe, req.user.id)) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const updateData = {}

    if (req.body.title !== undefined) updateData.title = req.body.title.trim()
    if (req.body.instructions !== undefined) updateData.instructions = req.body.instructions.trim()
    if (req.body.time !== undefined) updateData.time = req.body.time.trim()
    if (req.body.category !== undefined) updateData.category = req.body.category
    if (req.body.ingredients !== undefined) {
      const ingredients = normalizeIngredients(req.body.ingredients)
      if (ingredients.length === 0) {
        return res.status(400).json({ message: "Ingredients can't be empty" })
      }
      updateData.ingredients = ingredients
    }
    if (req.file) updateData.coverImage = req.file.filename

    const updatedRecipe = await populateRecipe(
      Recipes.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true
      })
    )

    return res.json({ message: "Recipe updated", recipe: updatedRecipe })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
}

const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id)
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    if (!ownsRecipe(recipe, req.user.id)) {
      return res.status(403).json({ message: "Not authorized" })
    }

    await User.updateMany({}, { $pull: { favourites: recipe._id } })
    await recipe.deleteOne()

    return res.json({ status: "ok" })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
}

const getFavouriteRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "favourites",
      populate: [
        { path: "category" },
        { path: "createdBy", select: "email" }
      ]
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    return res.json(user.favourites || [])
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const toggleFavouriteRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id)
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const recipeId = recipe._id.toString()
    const favourites = user.favourites.map(id => id.toString())
    const isFavourite = favourites.includes(recipeId)

    if (isFavourite) {
      user.favourites = user.favourites.filter(id => id.toString() !== recipeId)
    } else {
      user.favourites.push(recipe._id)
    }

    await user.save()

    return res.json({
      isFavourite: !isFavourite,
      favourites: user.favourites.map(id => id.toString())
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getRecipeStats = async (req, res) => {
  try {
    const totalRecipes = await Recipes.countDocuments()
    const recipesByCategory = await Recipes.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ])

    return res.json({ totalRecipes, recipesByCategory })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getRecipes,
  getRecipe,
  getRecipesByUser,
  getRecipeStats,
  getFavouriteRecipes,
  toggleFavouriteRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  upload
}
