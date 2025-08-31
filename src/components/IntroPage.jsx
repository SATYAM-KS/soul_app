import React from 'react'

function IntroPage({ onGetStarted, isMobileLayout }) {
  return (
    <div className={`intro-container ${isMobileLayout ? 'intro-mobile' : 'intro-pc'}`}>
      <div className="intro-content">
        <div className="logo-section">
          <img src="/logo.png" alt="SoulSignal Logo" className="logo" />
          <h1 className="app-title">SoulSignal</h1>
          <p className="app-tagline">Connect through soul, not just looks</p>
        </div>
        
        <div className="auth-buttons">
          <button className="btn-primary sign-up-btn" onClick={onGetStarted}>
            Get Started
          </button>
        </div>
        

      </div>
    </div>
  )
}

export default IntroPage
