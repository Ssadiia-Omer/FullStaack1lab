# 🍰 Food Recipe App

> A full-stack web application for sharing, discovering, and managing food recipes.
>
> **Created by**: [Ssadiia-Omer](https://github.com/Ssadiia-Omer)

Built with Node.js/Express backend and React frontend, with MongoDB Atlas for data storage.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Backend Configuration](#backend-configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## ✨ Features

### User Features
- **User Authentication**: Sign up and login with JWT-based authentication
- **Recipe Management**: Create, read, update, and delete recipes
- **Recipe Discovery**: Browse and search recipes by category
- **Favorites**: Save favorite recipes to personal collection
- **User Profile**: View recipes created by each user
- **Category Browsing**: Organize recipes by category (Appetizer, Main Course, Dessert, etc.)
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Admin/Developer Features
- **Image Upload**: Upload recipe images with multer file storage
- **Database Aggregation**: View recipe statistics by category
- **Secure API**: JWT-protected routes for authenticated operations
- **MongoDB Atlas Integration**: Cloud-based database with replica sets

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **File Upload**: multer
- **CORS**: cors middleware

### Frontend
- **Framework**: React
- **Build Tool**: Vite
- **Routing**: react-router-dom
- **HTTP Client**: axios
- **Styling**: CSS with responsive design

### DevOps
- **Package Manager**: npm
- **Development**: nodemon (auto-restart on changes)

## 📁 Project Structure

```
foodRecipeApp/
├── backend/
│   ├── config/
│   │   └── connectionDb.js          # MongoDB connection config
│   ├── controller/
│   │   ├── recipe.js                # Recipe CRUD logic
│   │   └── user.js                  # User auth logic
│   ├── middleware/
│   │   └── auth.js                  # JWT verification
│   ├── models/
│   │   ├── recipe.js                # Recipe schema
│   │   ├── user.js                  # User schema
│   │   └── category.js              # Category schema
│   ├── routes/
│   │   ├── recipe.js                # Recipe API routes
│   │   ├── user.js                  # User API routes
│   │   └── category.js              # Category API routes
│   ├── public/
│   │   └── images/                  # Uploaded recipe images
│   ├── package.json
│   ├── server.js                    # Express app entry point
│   └── .env                         # Environment variables
├── frontend/
│   └── food-blog-app/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Navbar.jsx
│       │   │   ├── Modal.jsx
│       │   │   ├── InputForm.jsx
│       │   │   ├── RecipeItems.jsx
│       │   │   └── Footer.jsx
│       │   ├── pages/
│       │   │   ├── Home.jsx
│       │   │   ├── AddFoodRecipe.jsx
│       │   │   ├── EditRecipe.jsx
│       │   │   └── RecipeDetails.jsx
│       │   ├── App.jsx
│       │   ├── App.css
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
└── README.md
```

## 📦 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git**
- **MongoDB Atlas Account** (free tier available) - [Sign up](https://www.mongodb.com/cloud/atlas)

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Ssadiia-Omer/FullStaack1lab.git
cd foodRecipeApp-main/foodRecipe
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (see Backend Configuration section)
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend/food-blog-app

# Install dependencies
npm install
```

## ⚙️ Backend Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=3000
CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/foodRecipe?retryWrites=true&w=majority
SECRET_KEY=your_jwt_secret_key_here
```

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add your IP address to the network access list
4. Create a database user with appropriate permissions
5. Get your connection string in the format: `mongodb+srv://username:password@cluster.mongodb.net/`
6. Add `/foodRecipe` database name to the end of the connection string

### DNS Fix for Node.js

The backend includes a DNS workaround for MongoDB Atlas SRV lookups. In `config/connectionDb.js`:

```javascript
const dns = require("dns")
dns.setServers(["8.8.8.8", "8.8.4.4"])
```

This ensures proper DNS resolution for MongoDB Atlas connections.

## 🏃 Running the Application

### Development Mode (Recommended)

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:3000` with auto-restart on file changes.

#### Terminal 2 - Frontend Development Server
```bash
cd frontend/food-blog-app
npm run dev
```
The frontend will start on `http://localhost:5173`

### Production Build

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend/food-blog-app
npm run build
```

## 📡 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### User Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/login` | No | User login |
| POST | `/signUp` | No | User registration |
| GET | `/user` | Yes | Get current user info |

**Login Request**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "64a1f2b3c4d5e6f7g8h9i0j1",
    "email": "user@example.com"
  }
}
```

#### Recipe Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/recipe` | No | Get all recipes |
| GET | `/recipe/:id` | No | Get single recipe |
| GET | `/recipe/user/:userId` | No | Get recipes by user |
| POST | `/recipe` | Yes | Create new recipe |
| PUT | `/recipe/:id` | Yes | Update recipe |
| DELETE | `/recipe/:id` | Yes | Delete recipe |
| GET | `/stats` | No | Get recipe statistics |

**Create Recipe Request**
```json
{
  "title": "Chocolate Cake",
  "ingredients": "2 cups flour, 1 cup sugar, 3 eggs",
  "instructions": "Mix dry ingredients, add wet ingredients...",
  "time": "45 mins",
  "category": "64a1f2b3c4d5e6f7g8h9i0j1",
  "file": "<image file>"
}
```

#### Category Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/category` | No | Get all categories |

## 💾 Database Schema

### User Schema
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  createdAt: Date (default: now)
}
```

### Recipe Schema
```javascript
{
  title: String (required),
  ingredients: String (required),
  instructions: String (required),
  time: String (required),
  coverImage: String,
  category: ObjectId (ref: Category),
  createdBy: ObjectId (ref: User),
  createdAt: Date (default: now)
}
```

### Category Schema
```javascript
{
  name: String (unique, required),
  description: String
}
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error: "Server selection timed out after 30000 ms"**
- Check your MongoDB Atlas IP whitelist
- Verify connection string is correct
- Check internet connectivity
- Verify USERNAME and PASSWORD in connection string don't contain special characters (URL encode if needed)

**Error: "querySrv ECONNREFUSED"**
- This is a DNS resolution issue
- The backend automatically handles this with custom DNS servers (Google's 8.8.8.8)
- If issue persists, check your firewall or network settings

### Recipe Upload Issues

**Error: "Recipe image is required"**
- Ensure you select an image file before submitting
- File size should be reasonable (< 5MB recommended)

**Error: "Invalid token"**
- Make sure you're logged in
- Token might have expired - try logging in again
- Check that Authorization header has "Bearer " prefix

### Frontend Build Issues

**Port 5173 already in use**
```bash
# Kill the process using port 5173 or use a different port
npm run dev -- --port 3001
```

### Node.js Memory Issues

If you encounter memory issues with large operations:
```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

---

**Made with ❤️ by [Ssadiia-Omer](https://github.com/Ssadiia-Omer)**

For questions or support, please open an issue on GitHub.




/*

Here’s a much shorter version:

---

# 🍰 Food Recipe App

Full-stack recipe app to create, share, and explore recipes.
Built with **Node.js/Express**, **React**, and **MongoDB Atlas**.

## ✨ Features

* User auth (JWT)
* CRUD recipes
* Search & categories
* Favorites & user profiles
* Image upload
* Responsive UI

## 🛠 Tech Stack

* **Backend**: Node.js, Express, MongoDB, Mongoose
* **Frontend**: React, Vite, Axios
* **Auth**: JWT, bcrypt

## 🚀 Setup

```bash
git clone <repo>
cd backend && npm install
cd ../frontend/food-blog-app && npm install
```

Create `.env` in backend:

```env
PORT=3000
CONNECTION_STRING=<your_mongo_uri>
SECRET_KEY=<your_secret>
```

## ▶️ Run

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev
```

## 📡 API

* Auth: `/login`, `/signUp`
* Recipes: `/recipe`
* Categories: `/category`

## 💾 Schemas

* **User**: email, password
* **Recipe**: title, ingredients, instructions, category
* **Category**: name, description

## 📝 License

MIT

---
*/