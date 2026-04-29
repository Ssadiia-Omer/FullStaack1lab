const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipes"
  }]
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)
