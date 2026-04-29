const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")
const connectDb = require("./config/connectionDb")
const verifyToken = require("./middleware/auth")
const { userLogin, userSignUp, getUser } = require("./controller/user")
const { getCategories, addCategory } = require("./controller/category")
const {
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
} = require("./controller/recipe")

dotenv.config()
connectDb()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/images", express.static(path.join(__dirname, "public/images")))

app.post("/signUp", userSignUp)
app.post("/login", userLogin)
app.get("/user/:id", verifyToken, getUser)

app.get("/category", getCategories)
app.post("/category", verifyToken, addCategory)

app.get("/recipe/stats", getRecipeStats)
app.get("/recipe/my", verifyToken, getRecipesByUser)
app.get("/recipe/user/:userId", verifyToken, getRecipesByUser)
app.get("/recipe/favourites", verifyToken, getFavouriteRecipes)
app.patch("/recipe/favourite/:id", verifyToken, toggleFavouriteRecipe)
app.get("/recipe", getRecipes)
app.get("/recipe/:id", getRecipe)
app.post("/recipe", verifyToken, upload.single("file"), addRecipe)
app.put("/recipe/:id", verifyToken, upload.single("file"), editRecipe)
app.delete("/recipe/:id", verifyToken, deleteRecipe)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
