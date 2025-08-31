import React from 'react'

function LayoutToggle({ isMobile, onToggle }) {
  return (
    <div className="toggle-container">
      <button 
        className={`toggle-btn ${isMobile ? 'active' : ''}`}
        onClick={() => onToggle()}
      >
        <span className="mobile-icon"></span>
      </button>
      <button 
        className={`toggle-btn ${!isMobile ? 'active' : ''}`}
        onClick={() => onToggle()}
      >
        <span className="pc-icon"></span>
      </button>
    </div>
  )
}

export default LayoutToggle
