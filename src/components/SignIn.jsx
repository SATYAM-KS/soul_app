import React, { useState } from 'react'
import { userService } from '../services/userService'

function SignIn({ onComplete, onBack }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSignIn = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false)
      setError('Sign in timed out. Please check your internet connection and try again.')
    }, 30000) // 30 second timeout

    try {
      console.log('Attempting to sign in...')
      console.log('Email:', formData.email)
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
      console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
      
      const response = await userService.signIn(formData.email, formData.password)
      console.log('Sign in response:', response)
      
      clearTimeout(timeoutId)
      
      if (response.error) {
        throw response.error
      }
      
      if (response.data && response.data.user) {
        console.log('User found:', response.data.user.id)
        try {
          const profile = await userService.getProfile(response.data.user.id)
          console.log('Profile retrieved:', profile)
          onComplete(profile)
        } catch (profileError) {
          console.error('Profile fetch error:', profileError)
          // If profile doesn't exist, create a basic one from user data
          const basicProfile = {
            id: response.data.user.id,
            email: response.data.user.email,
            name: response.data.user.user_metadata?.name || 'User',
            age: response.data.user.user_metadata?.age || 25,
            gender: response.data.user.user_metadata?.gender || 'Other',
            location: response.data.user.user_metadata?.location || 'Unknown',
            bio: response.data.user.user_metadata?.bio || '',
            photo: response.data.user.user_metadata?.photo || ''
          }
          console.log('Using basic profile:', basicProfile)
          onComplete(basicProfile)
        }
      } else {
        throw new Error('No user data received')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      clearTimeout(timeoutId)
      setError(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <h1 className="page-title">Sign In</h1>
      
      <div className="form-container">
        <h2>Welcome Back</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your password"
          />
        </div>

        <button
          className="btn-primary"
          onClick={handleSignIn}
          disabled={loading || !formData.email || !formData.password}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

                 <button
           className="btn-secondary"
           onClick={onBack}
           style={{ marginTop: '15px' }}
         >
           ← Back to Intro
         </button>

         <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', fontSize: '14px', color: '#6c757d' }}>
           <strong>Don't have an account?</strong><br/>
           The account you're trying to sign in with might not exist yet.<br/>
           Please go back and use "Sign Up" to create a new account first.
         </div>
      </div>
    </div>
  )
}

export default SignIn
