import React, { useState, useRef, useEffect } from 'react'
import { userService } from '../services/userService'

function SignUp({ onComplete, onBack }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    gender: '',
    location: '',
    bio: '',
    profileImage: null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stream, setStream] = useState(null)
  const [capturedImages, setCapturedImages] = useState([])
  const [selectedProfileImage, setSelectedProfileImage] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (step === 3) {
      startCamera()
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [step])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      context.drawImage(videoRef.current, 0, 0)
      
      canvasRef.current.toBlob((blob) => {
        const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' })
        const newImage = {
          id: Date.now(),
          url: URL.createObjectURL(blob),
          blob: file
        }
        setCapturedImages(prev => [...prev, newImage])
        if (!selectedProfileImage) {
          setSelectedProfileImage(newImage)
        }
      }, 'image/jpeg')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (step === 1 && formData.email && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword) {
      setStep(2)
    } else if (step === 2 && formData.name && formData.age && formData.gender && formData.location) {
      setStep(3)
    } else if (step === 3 && capturedImages.length > 0 && selectedProfileImage) {
      handleSignUp()
    }
  }

  const handleCreateAccount = () => {
    console.log('handleCreateAccount called')
    console.log('capturedImages.length:', capturedImages.length)
    console.log('selectedProfileImage:', selectedProfileImage)
    
    if (capturedImages.length > 0 && selectedProfileImage) {
      handleSignUp()
    } else {
      setError('Please take at least one photo and select it as your profile picture')
    }
  }

  const handleSignUp = async () => {
    console.log('handleSignUp called')
    console.log('Form data:', formData)
    console.log('Selected profile image:', selectedProfileImage)
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!selectedProfileImage) {
      setError('Please select a profile picture')
      return
    }

    setLoading(true)
    setError('')

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false)
      setError('Request timed out. Please check your internet connection and try again.')
    }, 30000) // 30 second timeout

    try {
      console.log('Starting account creation...')
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
      console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
      
      // For now, let's skip photo upload and just create the account
      const profile = {
        ...formData,
        photo: selectedProfileImage.url // Use the local URL for now
      }
      console.log('Creating profile:', profile)
      
      await userService.signUp(formData.email, formData.password, profile)
      console.log('Account created successfully')
      clearTimeout(timeoutId)
      onComplete(profile)
    } catch (error) {
      console.error('Error creating account:', error)
      clearTimeout(timeoutId)
      setError(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleRetake = () => {
    setCapturedImages([])
    setSelectedProfileImage(null)
  }

  const selectProfileImage = (image) => {
    setSelectedProfileImage(image)
  }

  const removeImage = (imageId) => {
    setCapturedImages(prev => prev.filter(img => img.id !== imageId))
    if (selectedProfileImage && selectedProfileImage.id === imageId) {
      setSelectedProfileImage(null)
    }
  }



  return (
    <div className="app-container">
      <h1 className="page-title">Create Your Profile</h1>
      
      <div className="step-indicator">
        Step {step} of 3
      </div>
      
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
      </div>

      {step === 1 && (
        <div className="form-container">
          <h2>Create Account</h2>
          
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

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Confirm your password"
            />
          </div>

                     <button
             className="btn-primary"
             onClick={handleNext}
             disabled={!formData.email || !formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword}
           >
             Next: Profile Info
           </button>

           {onBack && (
             <button
               className="btn-secondary"
               onClick={onBack}
               style={{ marginTop: '15px' }}
             >
               ← Back to Intro
             </button>
           )}
         </div>
       )}

      {step === 2 && (
        <div className="form-container">
          <h2>Profile Information</h2>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your age"
              min="18"
              max="100"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your city"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Tell us about yourself..."
              rows="4"
            />
          </div>

          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={!formData.name || !formData.age || !formData.gender || !formData.location}
          >
            Next: Take Photo
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="form-container">
          <h2>Take Your Profile Photo</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="camera-container">
            {capturedImages.length === 0 ? (
              <>
                <div className="camera-preview">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{ width: '100%', height: '100%', borderRadius: '12px' }}
                  />
                </div>
                <button className="btn-primary" onClick={capturePhoto}>
                  📸 Take Photo
                </button>
              </>
            ) : (
              <>
                <div className="camera-preview">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{ width: '100%', height: '100%', borderRadius: '12px' }}
                  />
                </div>
                <button className="btn-primary" onClick={capturePhoto}>
                  📸 Take Another Photo
                </button>
              </>
            )}
          </div>

          {capturedImages.length > 0 && (
            <div className="photos-section">
              <h3>Your Photos ({capturedImages.length})</h3>
              <p className="photo-instruction">Click on a photo to set it as your profile picture</p>
              
              <div className="photos-grid">
                {capturedImages.map((image) => (
                  <div 
                    key={image.id} 
                    className={`photo-item ${selectedProfileImage?.id === image.id ? 'selected' : ''}`}
                    onClick={() => selectProfileImage(image)}
                  >
                    <img 
                      src={image.url} 
                      alt="Profile" 
                      className="photo-thumbnail"
                    />
                    <button 
                      className="remove-photo-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage(image.id)
                      }}
                    >
                      ✕
                    </button>
                    {selectedProfileImage?.id === image.id && (
                      <div className="profile-badge">Profile</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {capturedImages.length > 0 && (
            <div className="action-buttons">
              <button className="btn-secondary" onClick={handleRetake}>
                🔄 Start Over
              </button>
                             <button 
                 className="btn-primary" 
                 onClick={handleCreateAccount} 
                 disabled={loading || !selectedProfileImage}
               >
                 {loading ? 'Creating Account...' : 'Create Account'}
               </button>
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}
    </div>
  )
}

export default SignUp
