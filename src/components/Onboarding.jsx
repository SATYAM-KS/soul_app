import React, { useState, useRef, useEffect } from 'react'
import { mobileAuthService } from '../services/mobileAuthService'

function Onboarding({ userData, onComplete }) {
  const [step, setStep] = useState(1) // 1: Profile Info, 2: Photos, 3: Soul Cards
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    location: '',
    bio: ''
  })
  const [capturedImages, setCapturedImages] = useState([])
  const [selectedProfileImage, setSelectedProfileImage] = useState(null)
  const [soulCardAnswers, setSoulCardAnswers] = useState({
    valuesBeliefs: ['', '', ''],
    hobbiesInterests: ['', '', ''],
    socialRelationships: ['', '', ''],
    dreamsAspirations: ['', '', ''],
    funQuirks: ['', '', '']
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stream, setStream] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (step === 2) {
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
      setError('Camera access denied. Please allow camera access to continue.')
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

  const selectProfileImage = (image) => {
    setSelectedProfileImage(image)
  }

  const removeImage = (imageId) => {
    setCapturedImages(prev => prev.filter(img => img.id !== imageId))
    if (selectedProfileImage && selectedProfileImage.id === imageId) {
      setSelectedProfileImage(null)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSoulCardChange = (category, index, value) => {
    setSoulCardAnswers(prev => ({
      ...prev,
      [category]: prev[category].map((item, i) => i === index ? value : item)
    }))
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.age || !formData.gender || !formData.location) {
        setError('Please fill in all required fields')
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (capturedImages.length === 0 || !selectedProfileImage) {
        setError('Please take at least one photo and select it as your profile picture')
        return
      }
      setStep(3)
    } else if (step === 3) {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    setError('')

    try {
      const profileData = {
        ...formData,
        mobileNumber: userData.mobileNumber,
        photo: selectedProfileImage.url
      }

      await mobileAuthService.createUserProfile(userData.userId, profileData)
      await mobileAuthService.saveSoulCard(userData.userId, soulCardAnswers)
      
      const completeProfile = {
        id: userData.userId,
        mobileNumber: userData.mobileNumber,
        ...profileData,
        soulCardAnswers
      }

      onComplete(completeProfile)
    } catch (error) {
      console.error('Onboarding error:', error)
      setError(error.message || 'Failed to complete setup')
    } finally {
      setLoading(false)
    }
  }

  const soulCardQuestions = {
    valuesBeliefs: [
      'What values are most important to you in life?',
      'How do you define success?',
      'What principle do you live by?'
    ],
    hobbiesInterests: [
      'What do you love doing in your free time?',
      'What hobby would you like to try?',
      'What interests you most?'
    ],
    socialRelationships: [
      'How do you prefer to spend time with friends?',
      'What makes a great relationship?',
      'How do you handle conflicts?'
    ],
    dreamsAspirations: [
      'What is your biggest dream?',
      'Where do you see yourself in 5 years?',
      'What would you like to achieve?'
    ],
    funQuirks: [
      'What is your weirdest habit?',
      'What makes you laugh the most?',
      'What is your guilty pleasure?'
    ]
  }

  return (
    <div className="app-container">
      <h1 className="page-title">Complete Your Profile</h1>
      
      <div className="step-indicator">
        Step {step} of 3
      </div>
      
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {step === 1 && (
        <div className="form-container">
          <h2>Tell Us About Yourself</h2>
          
          <div className="form-group">
            <label className="form-label">Full Name *</label>
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
            <label className="form-label">Email *</label>
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
            <label className="form-label">Age *</label>
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
            <label className="form-label">Gender *</label>
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
            <label className="form-label">Location *</label>
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
            disabled={!formData.name || !formData.email || !formData.age || !formData.gender || !formData.location}
          >
            Next: Take Photos
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="form-container">
          <h2>Take Your Photos</h2>
          
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
              <button className="btn-primary" onClick={handleNext}>
                Next: Soul Cards
              </button>
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}

      {step === 3 && (
        <div className="form-container">
          <h2>Complete Your Soul Cards</h2>
          <p style={{ color: '#5D5970', marginBottom: '30px' }}>
            Answer these questions to help others understand your personality
          </p>

          {Object.entries(soulCardQuestions).map(([category, questions]) => (
            <div key={category} style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#5D5970', marginBottom: '15px', textTransform: 'capitalize' }}>
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              {questions.map((question, index) => (
                <div key={index} className="form-group">
                  <label className="form-label">{question}</label>
                  <textarea
                    value={soulCardAnswers[category][index]}
                    onChange={(e) => handleSoulCardChange(category, index, e.target.value)}
                    className="form-input"
                    placeholder="Your answer..."
                    rows="3"
                  />
                </div>
              ))}
            </div>
          ))}

          <button
            className="btn-primary"
            onClick={handleComplete}
            disabled={loading}
          >
            {loading ? 'Completing Setup...' : 'Complete Setup'}
          </button>
        </div>
      )}
    </div>
  )
}

export default Onboarding
