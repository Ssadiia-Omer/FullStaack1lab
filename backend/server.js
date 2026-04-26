const express=require("express")
const path=require("path")
const app=express()
const dotenv=require("dotenv")
dotenv.config({ path: path.resolve(__dirname, ".env") })
console.log("CONNECTION STRING:", process.env.CONNECTION_STRING)
const connectDb=require("./config/connectionDb")
const cors=require("cors")

const PORT=process.env.PORT || 3000

const startServer = async () => {
    await connectDb()

    app.use(express.json())
    app.use(cors())
    app.use(express.static("public"))

    app.use("/",require("./routes/user"))
    app.use("/recipe",require("./routes/recipe"))
    app.use("/category",require("./routes/category"))

    app.listen(PORT, () => {
        console.log(`app is listening on port ${PORT}`)
    })
}

startServer().catch((error) => {
    console.error("Server failed to start:", error)
    process.exit(1)
})