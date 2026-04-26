/*const Category = require("../models/category")

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        res.json(categories)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const addCategory = async (req, res) => {
    try {
        const newCategory = await Category.create(req.body)
        res.status(201).json(newCategory)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

// module.exports = { getCategories, addCategory } */ 


const express = require("express")
const router = express.Router()

const Category = require("../models/category")

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        res.json(categories)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const addCategory = async (req, res) => {
    try {
        const newCategory = await Category.create(req.body)
        res.status(201).json(newCategory)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

router.get("/", getCategories)
router.post("/", addCategory)

module.exports = router