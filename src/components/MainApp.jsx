import React, { useState, useEffect } from 'react'
import NormalMode from './NormalMode'
import MysteryMode from './MysteryMode'

function MainApp({ userProfile, soulCardAnswers }) {
  const [currentMode, setCurrentMode] = useState('normal')
  const [profiles, setProfiles] = useState([])
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)

  useEffect(() => {
    generateMockProfiles()
  }, [])

  const generateMockProfiles = () => {
    const mockProfiles = [
      {
        id: 1,
        name: 'Sarah',
        age: 25,
        location: 'New York',
        bio: 'Adventure seeker and coffee enthusiast. Love hiking and trying new cuisines.',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        soulCards: {
          values: ['Family', 'Honesty', 'Inner peace'],
          hobbies: ['Photography', 'Travel', 'Cooking'],
          social: ['Trust', 'Quality time', 'Deep conversations'],
          dreams: ['World travel', 'Start a business', 'Learn languages'],
          quirks: ['Talk to plants', 'Dance while cooking', 'Collect rocks']
        }
      },
      {
        id: 2,
        name: 'Emma',
        age: 28,
        location: 'Los Angeles',
        bio: 'Creative soul who loves art, music, and meaningful conversations.',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        soulCards: {
          values: ['Creativity', 'Authenticity', 'Growth'],
          hobbies: ['Painting', 'Playing guitar', 'Reading'],
          social: ['Empathy', 'Shared experiences', 'Laughter'],
          dreams: ['Art gallery', 'Write a book', 'Help others'],
          quirks: ['Sing in the shower', 'Organize by color', 'Talk to animals']
        }
      },
      {
        id: 3,
        name: 'Jessica',
        age: 26,
        location: 'Chicago',
        bio: 'Fitness lover and foodie. Always up for trying new restaurants and workouts.',
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
        soulCards: {
          values: ['Health', 'Discipline', 'Balance'],
          hobbies: ['Gym workouts', 'Cooking', 'Yoga'],
          social: ['Support', 'Active lifestyle', 'Motivation'],
          dreams: ['Fitness business', 'Travel the world', 'Learn to surf'],
          quirks: ['Count calories', 'Workout at 5 AM', 'Meal prep Sundays']
        }
      }
    ]
    setProfiles(mockProfiles)
  }

  const handleSwipe = (direction) => {
    if (direction === 'like' || direction === 'super') {
      console.log(`Liked ${profiles[currentProfileIndex].name}`)
    }
    setCurrentProfileIndex(prev => Math.min(prev + 1, profiles.length - 1))
  }

  const resetProfiles = () => {
    setCurrentProfileIndex(0)
  }

  return (
    <div className="app-container">
      <h1 className="page-title">Welcome, {userProfile.name}! 💕</h1>
      
      <div className="mode-selector">
        <button
          className={`mode-btn ${currentMode === 'normal' ? 'active' : ''}`}
          onClick={() => setCurrentMode('normal')}
        >
          Normal Mode
        </button>
        <button
          className={`mode-btn ${currentMode === 'mystery' ? 'active' : ''}`}
          onClick={() => setCurrentMode('mystery')}
        >
          Mystery Mode
        </button>
      </div>

      {currentMode === 'normal' ? (
        <NormalMode
          profiles={profiles}
          currentIndex={currentProfileIndex}
          onSwipe={handleSwipe}
          onReset={resetProfiles}
        />
      ) : (
        <MysteryMode
          userProfile={userProfile}
          soulCardAnswers={soulCardAnswers}
        />
      )}
    </div>
  )
}

export default MainApp
