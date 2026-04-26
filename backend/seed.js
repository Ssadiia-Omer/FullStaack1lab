const mongoose = require('mongoose')
require('dotenv').config({ path: './.env' })
const connectDb = require('./config/connectionDb')
const User = require('./models/user')
const Category = require('./models/category')
const Recipe = require('./models/recipe')
const bcrypt = require('bcrypt')

const seedData = async () => {
    try {
        await connectDb()

        // Clear existing data
        await User.deleteMany()
        await Category.deleteMany()
        await Recipe.deleteMany()

        // Seed users
        const hashedPassword = await bcrypt.hash('password123', 10)
        const users = [
            { email: 'john.doe@example.com', password: hashedPassword },
            { email: 'jane.smith@example.com', password: hashedPassword },
            { email: 'bob.johnson@example.com', password: hashedPassword },
            { email: 'alice.williams@example.com', password: hashedPassword },
            { email: 'charlie.brown@example.com', password: hashedPassword }
        ]
        const createdUsers = await User.insertMany(users)

        // Seed categories
        const categories = [
            { name: 'Breakfast', description: 'Morning meals and breakfast recipes' },
            { name: 'Lunch', description: 'Midday meals and lunch recipes' },
            { name: 'Dinner', description: 'Evening meals and dinner recipes' },
            { name: 'Dessert', description: 'Sweet treats and dessert recipes' },
            { name: 'Appetizer', description: 'Starters and appetizer recipes' }
        ]
        const createdCategories = await Category.insertMany(categories)

        // Seed recipes
        const recipes = [
            {
                title: 'Pancakes',
                ingredients: ['2 cups flour', '2 eggs', '1 cup milk', '2 tbsp sugar'],
                instructions: 'Mix ingredients, cook on griddle until golden.',
                time: '20 mins',
                category: createdCategories[0]._id,
                createdBy: createdUsers[0]._id
            },
            {
                title: 'Caesar Salad',
                ingredients: ['Romaine lettuce', 'Croutons', 'Parmesan', 'Caesar dressing'],
                instructions: 'Toss lettuce with dressing, add croutons and cheese.',
                time: '10 mins',
                category: createdCategories[1]._id,
                createdBy: createdUsers[1]._id
            },
            {
                title: 'Spaghetti Bolognese',
                ingredients: ['Spaghetti', 'Ground beef', 'Tomato sauce', 'Onion', 'Garlic'],
                instructions: 'Cook pasta, brown meat with onion and garlic, add sauce, serve over pasta.',
                time: '30 mins',
                category: createdCategories[2]._id,
                createdBy: createdUsers[2]._id
            },
            {
                title: 'Chocolate Cake',
                ingredients: ['2 cups flour', '1 cup sugar', '1/2 cup cocoa', '2 eggs', '1 cup milk'],
                instructions: 'Mix dry ingredients, add wet, bake at 350F for 30 mins.',
                time: '45 mins',
                category: createdCategories[3]._id,
                createdBy: createdUsers[3]._id
            },
            {
                title: 'Bruschetta',
                ingredients: ['Bread', 'Tomatoes', 'Basil', 'Olive oil', 'Garlic'],
                instructions: 'Toast bread, rub with garlic, top with tomatoes and basil, drizzle oil.',
                time: '15 mins',
                category: createdCategories[4]._id,
                createdBy: createdUsers[4]._id
            }
        ]
        await Recipe.insertMany(recipes)

        console.log('Data seeded successfully')
        process.exit()
    } catch (error) {
        console.error('Seeding error:', error)
        process.exit(1)
    }
}

seedData()
