const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const safeUser = (user) => ({
  _id: user._id,
  email: user.email,
  favourites: user.favourites || []
})

const createToken = (user) => {
  return jwt.sign({ email: user.email, id: user._id }, process.env.SECRET_KEY)
}

const userSignUp = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" })
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" })
    }

    const hashPwd = await bcrypt.hash(password, 10)
    const newUser = await User.create({
      email: email.toLowerCase().trim(),
      password: hashPwd
    })

    return res.status(201).json({ token: createToken(newUser), user: safeUser(newUser) })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

const userLogin = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" })
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (user && await bcrypt.compare(password, user.password)) {
      return res.status(200).json({ token: createToken(user), user: safeUser(user) })
    }

    return res.status(400).json({ error: "Invalid credentials" })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

const getUser = async (req, res) => {
  if (req.params.id !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" })
  }

  const user = await User.findById(req.user.id)
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  return res.json(safeUser(user))
}

module.exports = { userLogin, userSignUp, getUser }
