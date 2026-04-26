const mongoose = require("mongoose")
const dns = require("dns")

dns.setServers(["8.8.8.8", "8.8.4.4"])

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING)
        console.log("MongoDB connected successfully...")
    } catch (error) {
        console.log("MongoDB connection failed:", error.message)
        process.exit(1)
    }
}

module.exports = connectDb