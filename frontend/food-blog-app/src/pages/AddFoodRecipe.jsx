
import { useEffect, useState } from "react";
import axios from "axios";

const AddFoodRecipe = () => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3000/category");
        setCategories(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a recipe image");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("ingredients", ingredients);
    formData.append("instructions", instructions);
    formData.append("time", time);
    formData.append("category", category);
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/recipe", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Recipe added successfully!");

      setTitle("");
      setIngredients("");
      setInstructions("");
      setTime("");
      setCategory("");
      setFile(null);
    } catch (err) {
      console.log(err);
      const errorMsg = err.response?.data?.message || "Error adding recipe";
      alert(errorMsg);
    }
  };

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
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <button type="submit" className="submit-button">Add Recipe</button>
        </form>
      </div>
    </section>
  );
};

export default AddFoodRecipe;