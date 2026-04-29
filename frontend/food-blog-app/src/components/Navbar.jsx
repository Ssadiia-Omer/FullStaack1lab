import { useEffect, useState } from 'react'
import Modal from './Modal'
import InputForm from './InputForm'
import { NavLink, useNavigate } from 'react-router-dom'

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"))
  } catch {
    return null
  }
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [user, setUser] = useState(getStoredUser())
  const navigate = useNavigate()

  const isLoggedIn = Boolean(token)

  useEffect(() => {
    const syncAuthState = () => {
      setToken(localStorage.getItem("token"))
      setUser(getStoredUser())
    }

    window.addEventListener("auth-change", syncAuthState)
    return () => window.removeEventListener("auth-change", syncAuthState)
  }, [])

  const handleAuthSuccess = (loggedInUser) => {
    setToken(localStorage.getItem("token"))
    setUser(loggedInUser)
  }

  const checkLogin = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setToken(null)
      setUser(null)
      window.dispatchEvent(new Event("auth-change"))
      navigate("/")
      return
    }

    setIsOpen(true)
  }

  const requireLogin = (e) => {
    if (!isLoggedIn) {
      e.preventDefault()
      setIsOpen(true)
    }
  }

  return (
    <>
      <header>
        <h2>Food Blog</h2>
        <ul>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/myRecipe" onClick={requireLogin}>My Recipe</NavLink></li>
          <li><NavLink to="/favRecipe" onClick={requireLogin}>Favourites</NavLink></li>
          <li>
            <button type='button' className='login' onClick={checkLogin}>
              {isLoggedIn ? `Logout${user?.email ? ` (${user.email})` : ""}` : "Login"}
            </button>
          </li>
        </ul>
      </header>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} onAuthSuccess={handleAuthSuccess} />
        </Modal>
      )}
    </>
  )
}
