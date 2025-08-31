import React from 'react'

function NormalMode({ profiles, currentIndex, onSwipe, onReset }) {
  if (profiles.length === 0 || currentIndex >= profiles.length) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <h2>No more profiles to show!</h2>
        <p style={{ margin: '20px 0', color: '#666' }}>
          You've seen all available profiles. Check back later for new matches!
        </p>
        <button className="btn-primary" onClick={onReset}>
          Reset Profiles
        </button>
      </div>
    )
  }

  const currentProfile = profiles[currentIndex]

  return (
    <div className="profile-card">
      <img 
        src={currentProfile.profileImage} 
        alt={currentProfile.name}
        className="profile-image"
      />
      
      <div className="profile-info">
        <h2 style={{ marginBottom: '8px', color: '#5D5970' }}>
          {currentProfile.name}, {currentProfile.age}
        </h2>
        <p style={{ color: '#666', marginBottom: '16px' }}>
          📍 {currentProfile.location}
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
          {currentProfile.bio}
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#5D5970', marginBottom: '12px' }}>Soul Cards Preview:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
            {Object.entries(currentProfile.soulCards).slice(0, 3).map(([key, values]) => (
              <div key={key} style={{ 
                background: '#FAEBE8', 
                padding: '8px', 
                borderRadius: '8px', 
                fontSize: '12px',
                textAlign: 'center'
              }}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong>
                <div style={{ fontSize: '10px', color: '#666' }}>
                  {values[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="swipe-buttons">
        <button 
          className="swipe-btn dislike"
          onClick={() => onSwipe('dislike')}
          title="Dislike"
        >
          ❌
        </button>
        
        <button 
          className="swipe-btn super"
          onClick={() => onSwipe('super')}
          title="Super Like"
        >
          ⭐
        </button>
        
        <button 
          className="swipe-btn like"
          onClick={() => onSwipe('like')}
          title="Like"
        >
          ❤️
        </button>
      </div>
      
      <div style={{ textAlign: 'center', padding: '16px', color: '#666', fontSize: '14px' }}>
        Profile {currentIndex + 1} of {profiles.length}
      </div>
    </div>
  )
}

export default NormalMode
