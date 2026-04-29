import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API_BASE = "http://localhost:3000"

const getOwnerId = (createdBy) => {
  if (!createdBy) return ""
  return typeof createdBy === "object" ? createdBy._id : createdBy
}

const getCurrentUserId = () => {
  try {
    return JSON.parse(localStorage.getItem("user"))?._id || ""
  } catch {
    return ""
  }
}

export default function EditRecipe() {
  const [recipeData, setRecipeData] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    time: "",
    category: "",
    file: null
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const currentUserId = getCurrentUserId()

    if (!token || !currentUserId) {
      alert("Please login to edit recipes")
      navigate("/")
      return
    }

    const getData = async () => {
      try {
        const [recipeResponse, categoryResponse] = await Promise.all([
          axios.get(`${API_BASE}/recipe/${id}`),
          axios.get(`${API_BASE}/category`)
        ])

        const recipe = recipeResponse.data
        const ownerId = getOwnerId(recipe.createdBy)

        if (ownerId !== currentUserId) {
          alert("You can only edit your own recipes")
          navigate("/myRecipe")
          return
        }

        setCategories(Array.isArray(categoryResponse.data) ? categoryResponse.data : [])
        setRecipeData({
          title: recipe.title || "",
          ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join(", ") : "",
          instructions: recipe.instructions || "",
          time: recipe.time || "",
          category: getOwnerId(recipe.category),
          file: null
        })
      } catch (err) {
        console.error(err)
        setError(err.response?.data?.message || "Recipe not found")
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [id, navigate])

  const onHandleChange = (e) => {
    const { name, value, files } = e.target
    setRecipeData(previous => ({
      ...previous,
      [name]: name === "file" ? files[0] : value
    }))
  }

  const onHandleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("title", recipeData.title)
    formData.append("ingredients", recipeData.ingredients)
    formData.append("instructions", recipeData.instructions)
    formData.append("time", recipeData.time)
    formData.append("category", recipeData.category)
    if (recipeData.file) {
      formData.append("file", recipeData.file)
    }

    try {
      await axios.put(`${API_BASE}/recipe/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      alert("Recipe updated successfully")
      navigate("/myRecipe")
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Could not update recipe")
    }
  }

  if (loading) {
    return <div className='loading'>Loading recipe...</div>
  }

  if (error) {
    return <div className='loading'>{error}</div>
  }

  return (
    <section className="add-recipe-page">
      <div className="page-heading">
        <h2>Edit Recipe</h2>
        <p>Update your recipe details. Only the owner of this recipe can save changes.</p>
      </div>

      <div className="recipe-form-card">
        <form className='recipe-form' onSubmit={onHandleSubmit}>
          <div className='form-group'>
            <label>Title</label>
            <input type="text" name="title" onChange={onHandleChange} value={recipeData.title} required />
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label>Cooking Time</label>
              <input type="text" name="time" onChange={onHandleChange} value={recipeData.time} required />
            </div>
            <div className='form-group'>
              <label>Category</label>
              <select name="category" value={recipeData.category} onChange={onHandleChange} required>
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className='form-group'>
            <label>Ingredients</label>
            <textarea name="ingredients" rows="5" onChange={onHandleChange} value={recipeData.ingredients} required />
          </div>

          <div className='form-group'>
            <label>Instructions</label>
            <textarea name="instructions" rows="5" onChange={onHandleChange} value={recipeData.instructions} required />
          </div>

          <div className='form-group'>
            <label>Recipe Image</label>
            <input type="file" name="file" accept="image/*" onChange={onHandleChange} />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">Update Recipe</button>
            <button type="button" className="secondary-button" onClick={() => navigate("/myRecipe")}>Cancel</button>
          </div>
        </form>
      </div>
    </section>
  )
}
