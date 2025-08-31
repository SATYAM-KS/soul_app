import React, { useState } from 'react'

function Navbar({ userProfile, onLogout, isMobileLayout }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <nav className={`navbar ${isMobileLayout ? 'navbar-mobile' : 'navbar-pc'}`}>
      <div className="nav-brand">
        <h2>SoulSignal</h2>
      </div>
      
      {userProfile && (
        <div className="nav-user">
          <div 
            className="user-avatar"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            {userProfile.photo ? (
              <img src={userProfile.photo} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {userProfile.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          
          {showProfileMenu && (
            <div className="profile-menu">
              <div className="profile-info">
                <h4>{userProfile.name}</h4>
                <p>{userProfile.age} • {userProfile.gender}</p>
                <p>{userProfile.location}</p>
              </div>
              <div className="profile-actions">
                <button className="profile-btn" onClick={() => setShowProfileMenu(false)}>
                  Edit Profile
                </button>
                <button className="profile-btn logout-btn" onClick={onLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
