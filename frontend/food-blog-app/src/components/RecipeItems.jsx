// frontend/food-blog-app/src/components/RecipeItems.jsx
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { BsStopwatchFill } from "react-icons/bs"
import { FaHeart } from "react-icons/fa6"
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"

const API_BASE = "http://localhost:3000"
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/220x180?text=No+Image'

const getImageSrc = (coverImage) => {
    if (!coverImage) return PLACEHOLDER_IMAGE
    if (typeof coverImage === 'string' && (coverImage.startsWith('http://') || coverImage.startsWith('https://'))) {
        return coverImage
    }
    return `${API_BASE}/images/${coverImage}`
}

export default function RecipeItems() {
    const [allRecipes, setAllRecipes] = useState([])
    const navigate = useNavigate()
    const path = window.location.pathname === "/myRecipe"
    const favRecipes = JSON.parse(localStorage.getItem("fav")) || []
    const [sortOrder, setSortOrder] = useState("asc")

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get(`${API_BASE}/recipe`)
                setAllRecipes(Array.isArray(response.data) ? response.data : [])
            } catch (err) {
                console.error("Failed to load recipes", err)
            }
        }
        fetchRecipes()
    }, [])

    const onDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            try {
                await axios.delete(`${API_BASE}/recipe/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                })
                setAllRecipes(recipes => recipes.filter(recipe => recipe._id !== id))
                alert("Recipe deleted successfully")
            } catch (err) {
                console.log(err)
                alert("Error deleting recipe")
            }
        }
    }

    const favToggle = (id) => {
        let updatedFav = [...favRecipes]
        if (updatedFav.includes(id)) {
            updatedFav = updatedFav.filter(recipeId => recipeId !== id)
        } else {
            updatedFav.push(id)
        }
        localStorage.setItem("fav", JSON.stringify(updatedFav))
        // Force re-render by updating a state (optional)
        setAllRecipes([...allRecipes])
    }

    const sortedRecipes = [...allRecipes].sort((a, b) => {
        if (sortOrder === "asc") {
            return a.title.localeCompare(b.title)
        } else {
            return b.title.localeCompare(a.title)
        }
    })

    return (
        <>
            <div className='recipe-list'>
                <div className='sort-controls'>
                    <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                        Sort {sortOrder === "asc" ? "Z-A" : "A-Z"}
                    </button>
                </div>
                {sortedRecipes.length === 0 ? (
                    <div className='no-recipes'>
                        <p>No recipes found.</p>
                    </div>
                ) : (
                    sortedRecipes.map(recipe => {
                        const imageSrc = getImageSrc(recipe.coverImage)
                        return (
                            <div key={recipe._id} className='recipe-card'>
                                <img
                                    src={imageSrc}
                                    alt={recipe.title}
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER_IMAGE }}
                                />
                                <div className='recipe-details'>
                                    <h3>{recipe.title}</h3>
                                    <p><BsStopwatchFill /> {recipe.time}</p>
                                    <div className='recipe-actions'>
                                        <button onClick={() => navigate(`/recipe/${recipe._id}`)}>View</button> 
                                        {path && <button onClick={() => navigate(`/editRecipe/${recipe._id}`)}><FaEdit /></button>}
                                        {path && <button onClick={() => onDelete(recipe._id)}><MdDelete /></button>}
                                        <button onClick={() => favToggle(recipe._id)}>
                                            <FaHeart color={favRecipes.includes(recipe._id) ? "red" : "grey"} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </>
    )
}