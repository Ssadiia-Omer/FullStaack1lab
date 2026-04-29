import { useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

const API_BASE = "http://localhost:3000"

export default function InputForm({ setIsOpen, onAuthSuccess }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const endpoint = isSignUp ? "signUp" : "login"

    try {
      const res = await axios.post(`${API_BASE}/${endpoint}`, { email, password })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      window.dispatchEvent(new Event("auth-change"))
      onAuthSuccess?.(res.data.user)
      setIsOpen()
      navigate("/addRecipe")
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Authentication failed")
    }
  }

  return (
    <form className='form auth-form' onSubmit={handleOnSubmit}>
      <h3>{isSignUp ? "Create account" : "Login"}</h3>
      <div className='form-control'>
        <label>Email</label>
        <input
          type="email"
          className='input'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className='form-control'>
        <label>Password</label>
        <input
          type="password"
          className='input'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type='submit' className='form-submit'>{isSignUp ? "Sign Up" : "Login"}</button>
      {error && <h6 className='error'>{error}</h6>}
      <p onClick={() => setIsSignUp(previous => !previous)}>
        {isSignUp ? "Already have an account? Login" : "Create new account"}
      </p>
    </form>
  )
}

InputForm.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  onAuthSuccess: PropTypes.func,
}
