import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { BsStopwatchFill } from "react-icons/bs"
import { FaHeart, FaRegHeart } from "react-icons/fa6"
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

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`
})

export default function RecipeItems({ mode = "all" }) {
  const [recipes, setRecipes] = useState([])
  const [favIds, setFavIds] = useState([])
  const [sortOrder, setSortOrder] = useState("asc")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [token, setToken] = useState(localStorage.getItem("token"))
  const navigate = useNavigate()
  const isMyRecipePage = mode === "mine"
  const isFavouritePage = mode === "favourites"

  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("token"))
    window.addEventListener("auth-change", syncToken)
    return () => window.removeEventListener("auth-change", syncToken)
  }, [])

  const loadFavouriteIds = useCallback(async () => {
    if (!token) {
      setFavIds([])
      return
    }

    const response = await axios.get(`${API_BASE}/recipe/favourites`, { headers: authHeaders() })
    setFavIds(response.data.map(recipe => recipe._id))
  }, [token])

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true)
      setError("")

      try {
        if ((isMyRecipePage || isFavouritePage) && !token) {
          setRecipes([])
          setError("Please login to view this page.")
          return
        }

        if (isMyRecipePage) {
          const response = await axios.get(`${API_BASE}/recipe/my`, { headers: authHeaders() })
          setRecipes(Array.isArray(response.data) ? response.data : [])
          await loadFavouriteIds()
          return
        }

        if (isFavouritePage) {
          const response = await axios.get(`${API_BASE}/recipe/favourites`, { headers: authHeaders() })
          const favourites = Array.isArray(response.data) ? response.data : []
          setRecipes(favourites)
          setFavIds(favourites.map(recipe => recipe._id))
          return
        }

        const response = await axios.get(`${API_BASE}/recipe`)
        setRecipes(Array.isArray(response.data) ? response.data : [])
        await loadFavouriteIds()
      } catch (err) {
        console.error("Failed to load recipes", err)
        setError(err.response?.data?.message || "Failed to load recipes")
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [isMyRecipePage, isFavouritePage, loadFavouriteIds, token])

  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return

    try {
      await axios.delete(`${API_BASE}/recipe/${id}`, { headers: authHeaders() })
      setRecipes(currentRecipes => currentRecipes.filter(recipe => recipe._id !== id))
      setFavIds(currentIds => currentIds.filter(recipeId => recipeId !== id))
      alert("Recipe deleted successfully")
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Error deleting recipe")
    }
  }

  const favToggle = async (id) => {
    if (!token) {
      alert("Please login to add favourites")
      return
    }

    try {
      const response = await axios.patch(`${API_BASE}/recipe/favourite/${id}`, {}, { headers: authHeaders() })
      setFavIds(response.data.favourites || [])

      if (isFavouritePage && !response.data.isFavourite) {
        setRecipes(currentRecipes => currentRecipes.filter(recipe => recipe._id !== id))
      }
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Could not update favourites")
    }
  }

  const sortedRecipes = [...recipes].sort((a, b) => {
    const firstTitle = a.title || ""
    const secondTitle = b.title || ""
    return sortOrder === "asc"
      ? firstTitle.localeCompare(secondTitle)
      : secondTitle.localeCompare(firstTitle)
  })

  const heading = isMyRecipePage ? "My Recipes" : isFavouritePage ? "My Favourites" : "Latest Recipes"

  if (loading) {
    return <div className='no-recipes'><p>Loading recipes...</p></div>
  }

  return (
    <div className='recipe-list'>
      <div className='list-toolbar'>
        <h2>{heading}</h2>
        <div className='toolbar-actions'>
          {isMyRecipePage && (
            <button type='button' className='add-btn' onClick={() => navigate("/addRecipe")}>Add New Recipe</button>
          )}
          <button type='button' className='sort-button' onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            Sort {sortOrder === "asc" ? "Z-A" : "A-Z"}
          </button>
        </div>
      </div>

      {error && <div className='no-recipes'><p>{error}</p></div>}

      {!error && sortedRecipes.length === 0 ? (
        <div className='no-recipes'>
          <p>{isFavouritePage ? "No favourite recipes found." : isMyRecipePage ? "You have not posted any recipes yet." : "No recipes found."}</p>
          {isMyRecipePage && <button type='button' className='add-btn' onClick={() => navigate("/addRecipe")}>Add your first recipe</button>}
        </div>
      ) : (
        sortedRecipes.map(recipe => {
          const imageSrc = getImageSrc(recipe.coverImage)
          const isFavourite = favIds.includes(recipe._id)

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
                  <button type='button' className='view-btn' onClick={() => navigate(`/recipe/${recipe._id}`)}>View</button>
                  {isMyRecipePage && (
                    <button type='button' className='edit-btn' onClick={() => navigate(`/editRecipe/${recipe._id}`)} aria-label={`Edit ${recipe.title}`}>
                      <FaEdit /> Edit
                    </button>
                  )}
                  {isMyRecipePage && (
                    <button type='button' className='delete-btn' onClick={() => onDelete(recipe._id)} aria-label={`Delete ${recipe.title}`}>
                      <MdDelete /> Delete
                    </button>
                  )}
                  <button
                    type='button'
                    className={`fav-btn ${isFavourite ? "active-fav" : ""}`}
                    onClick={() => favToggle(recipe._id)}
                    aria-label={isFavourite ? `Remove ${recipe.title} from favourites` : `Add ${recipe.title} to favourites`}
                  >
                    {isFavourite ? <FaHeart /> : <FaRegHeart />} {isFavourite ? "Saved" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

RecipeItems.propTypes = {
  mode: PropTypes.oneOf(["all", "mine", "favourites"])
}
