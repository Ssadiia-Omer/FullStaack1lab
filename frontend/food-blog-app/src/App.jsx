// frontend/food-blog-app/src/App.jsx

import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AddFoodRecipe from './pages/AddFoodRecipe'
import EditRecipe from './pages/EditRecipe'
import RecipeDetails from './pages/RecipeDetails'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RecipeItems from './components/RecipeItems'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addRecipe" element={<AddFoodRecipe />} />
        <Route path="/editRecipe/:id" element={<EditRecipe />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />

        <Route path="/myRecipe" element={<div className="recipe"><RecipeItems /></div>} />
        <Route path="/favRecipe" element={<div className="recipe"><RecipeItems /></div>} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App