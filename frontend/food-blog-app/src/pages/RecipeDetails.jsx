// frontend/food-blog-app/src/pages/RecipeDetails.jsx
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import profileImg from '../assets/profile.png'

const API_BASE = "http://localhost:3000"
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/320x240?text=No+Image'

const getImageSrc = (coverImage) => {
    if (!coverImage) return PLACEHOLDER_IMAGE
    if (typeof coverImage === 'string' && (coverImage.startsWith('http://') || coverImage.startsWith('https://'))) {
        return coverImage
    }
    return `${API_BASE}/images/${coverImage}`
}

export default function RecipeDetails() {
    const { id } = useParams()
    const [recipe, setRecipe] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(`${API_BASE}/recipe/${id}`)
                if (!response.ok) {
                    throw new Error('Recipe not found')
                }
                const data = await response.json()
                setRecipe(data)
            } catch (err) {
                console.error("Failed to fetch recipe", err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchRecipe()
        }
    }, [id])

    if (loading) {
        return <div className='loading'>Loading recipe...</div>
    }

    if (error || !recipe) {
        return <div className='loading'>Recipe not found</div>
    }

    const imageSrc = getImageSrc(recipe.coverImage)
    const authorEmail = recipe.createdBy?.email || recipe.email || 'Unknown author'

    return (
        <div className='outer-container'>
            <div className='profile'>
                <img src={profileImg} width="50px" height="50px" alt="Profile" />
                <h5>{authorEmail}</h5>
            </div>
            <h3 className='title'>{recipe.title}</h3>
            <img
                src={imageSrc}
                width="320px"
                height="240px"
                alt={recipe.title}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER_IMAGE }}
            />
            <div className='recipe-details'>
                <div className='ingredients'>
                    <h4>Ingredients</h4>
                    <ul>
                        {Array.isArray(recipe.ingredients) && recipe.ingredients.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div className='instructions'>
                    <h4>Instructions</h4>
                    <span>{recipe.instructions}</span>
                </div>
            </div>
        </div>
    )
}