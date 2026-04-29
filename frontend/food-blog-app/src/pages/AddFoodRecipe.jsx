import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const API_BASE = "http://localhost:3000"

const AddFoodRecipe = () => {
  const [title, setTitle] = useState("")
  const [ingredients, setIngredients] = useState("")
  const [instructions, setInstructions] = useState("")
  const [time, setTime] = useState("")
  const [category, setCategory] = useState("")
  const [file, setFile] = useState(null)
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE}/category`)
        setCategories(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        console.error(err)
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")
    if (!token) {
      alert("Please login to add a recipe")
      return
    }

    if (!file) {
      alert("Please select a recipe image")
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("ingredients", ingredients)
    formData.append("instructions", instructions)
    formData.append("time", time)
    formData.append("category", category)
    formData.append("file", file)

    try {
      await axios.post(`${API_BASE}/recipe`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      alert("Recipe added successfully!")
      navigate("/myRecipe")
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || "Error adding recipe")
    }
  }

  return (
    <section className="add-recipe-page">
      <div className="page-heading">
        <h2>Add Food Recipe</h2>
        <p>Share your favorite dish with the community by filling in the recipe details below.</p>
      </div>

      <div className="recipe-form-card">
        <form className="recipe-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter recipe title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Ingredients</label>
            <textarea
              placeholder="List ingredients separated by commas"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Instructions</label>
            <textarea
              placeholder="Write cooking instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cooking Time</label>
              <input
                type="text"
                placeholder="e.g. 30 mins"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Recipe Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">Add Recipe</button>
            <button type="button" className="secondary-button" onClick={() => navigate("/myRecipe")}>Cancel</button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default AddFoodRecipe
