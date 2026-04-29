const jwt = require("jsonwebtoken")

const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ message: "Authentication token is required" })
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7)
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" })
    }

    req.user = decoded
    next()
  })
}

module.exports = verifyToken
