import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LayoutToggle from './components/LayoutToggle'
import Navbar from './components/Navbar'
import IntroPage from './components/IntroPage'
import MobileAuth from './components/MobileAuth'
import Onboarding from './components/Onboarding'
import SoulCards from './components/SoulCards'
import MainApp from './components/MainApp'
import './App.css'

function App() {
  const [isMobileLayout, setIsMobileLayout] = useState(true)
  const [showIntro, setShowIntro] = useState(true)
  const [currentView, setCurrentView] = useState('intro') // 'intro', 'mobile-auth', 'onboarding'
  const [userProfile, setUserProfile] = useState(null)
  const [soulCardAnswers, setSoulCardAnswers] = useState({})
  const [authData, setAuthData] = useState(null)

  const handleProfileComplete = (profile, answers) => {
    setUserProfile(profile)
    setSoulCardAnswers(answers)
  }

  const handleGetStarted = () => {
    setCurrentView('mobile-auth')
    setShowIntro(false)
  }

  const handleBackToIntro = () => {
    setCurrentView('intro')
    setShowIntro(true)
    setAuthData(null)
  }

  const handleAuthSuccess = (data, userType) => {
    setAuthData(data)
    if (userType === 'existing') {
      setUserProfile(data)
      setCurrentView('dashboard')
    } else {
      setCurrentView('onboarding')
    }
  }

  const handleOnboardingComplete = (profile) => {
    setUserProfile(profile)
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    setUserProfile(null)
    setSoulCardAnswers({})
    setAuthData(null)
    setCurrentView('intro')
    setShowIntro(true)
  }

  return (
    <Router>
      <div className="background-animation">
        <div className="floating-element heart">❤️</div>
        <div className="floating-element star">⭐</div>
        <div className="floating-element flower">🌸</div>
        <div className="floating-element sparkle">✨</div>
        <div className="floating-element heart">💖</div>
        <div className="floating-element star">🌟</div>
        <div className="floating-element flower">🌺</div>
        <div className="floating-element sparkle">💫</div>
        <div className="floating-element heart">💝</div>
        <div className="floating-element star">⭐</div>
        <div className="floating-element flower">🌹</div>
        <div className="floating-element sparkle">✨</div>
        <div className="floating-element heart">💕</div>
        <div className="floating-element star">🌟</div>
        <div className="floating-element flower">🌷</div>
        <div className="floating-element sparkle">💫</div>
      </div>
      
      <div className={isMobileLayout ? 'mobile-layout' : 'pc-layout'}>
        <LayoutToggle 
          isMobile={isMobileLayout} 
          onToggle={() => setIsMobileLayout(!isMobileLayout)} 
        />
        
        {showIntro ? (
          <IntroPage onGetStarted={handleGetStarted} isMobileLayout={isMobileLayout} />
        ) : currentView === 'mobile-auth' ? (
          <MobileAuth onAuthSuccess={handleAuthSuccess} onBack={handleBackToIntro} />
        ) : currentView === 'onboarding' ? (
          <Onboarding userData={authData} onComplete={handleOnboardingComplete} />
        ) : currentView === 'dashboard' ? (
          <>
            <Navbar 
              userProfile={userProfile} 
              onLogout={handleLogout} 
              isMobileLayout={isMobileLayout} 
            />
            
            <Routes>
              <Route path="/" element={
                <MainApp userProfile={userProfile} soulCardAnswers={userProfile?.soulCardAnswers || {}} />
              } />
            </Routes>
          </>
        ) : null}
      </div>
    </Router>
  )
}

export default App
