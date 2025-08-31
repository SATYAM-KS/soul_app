import React, { useState } from 'react'

function SoulCards({ onComplete }) {
  const [currentCard, setCurrentCard] = useState(0)
  const [answers, setAnswers] = useState({})

  const soulCards = [
    {
      id: 'values',
      title: 'Values & Beliefs',
      questions: [
        'What is most important to you in life?',
        'What values do you want to pass on to future generations?',
        'What do you think makes a person truly happy?'
      ]
    },
    {
      id: 'hobbies',
      title: 'Hobbies & Interests',
      questions: [
        'What activity makes you lose track of time?',
        'What would you do if you had unlimited free time?',
        'What hobby have you always wanted to try but haven\'t?'
      ]
    },
    {
      id: 'social',
      title: 'Social & Relationships',
      questions: [
        'What quality do you value most in friendships?',
        'How do you prefer to spend time with loved ones?',
        'What makes you feel most connected to someone?'
      ]
    },
    {
      id: 'dreams',
      title: 'Dreams & Aspirations',
      questions: [
        'What is your biggest dream for the next 5 years?',
        'What would you do if you knew you couldn\'t fail?',
        'What legacy do you want to leave behind?'
      ]
    },
    {
      id: 'quirks',
      title: 'Fun & Quirks',
      questions: [
        'What\'s your most unusual habit or quirk?',
        'What makes you laugh uncontrollably?',
        'What\'s something you do that others find strange?'
      ]
    }
  ]

  const handleAnswerChange = (questionIndex, value) => {
    const cardId = soulCards[currentCard].id
    setAnswers(prev => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        [questionIndex]: value
      }
    }))
  }

  const isCurrentCardComplete = () => {
    const cardId = soulCards[currentCard].id
    const cardAnswers = answers[cardId] || {}
    return soulCards[currentCard].questions.every((_, index) => cardAnswers[index])
  }

  const handleNext = () => {
    if (currentCard < soulCards.length - 1) {
      setCurrentCard(currentCard + 1)
    } else {
      onComplete(answers)
    }
  }

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1)
    }
  }

  const progress = ((currentCard + 1) / soulCards.length) * 100

  return (
    <div className="app-container">
      <h1 className="page-title">Discover Your Soul</h1>
      
      <div className="step-indicator">
        Card {currentCard + 1} of {soulCards.length}
      </div>
      
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="form-container">
        <div className="soul-card">
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#5D5970' }}>
            {soulCards[currentCard].title}
          </h2>
          
          {soulCards[currentCard].questions.map((question, index) => (
            <div key={index} className="form-group">
              <label className="form-label">
                {index + 1}. {question}
              </label>
              <textarea
                value={answers[soulCards[currentCard].id]?.[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="form-input"
                placeholder="Share your thoughts..."
                rows="3"
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
          {currentCard > 0 && (
            <button className="btn-secondary" onClick={handlePrevious}>
              ← Previous
            </button>
          )}
          
          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={!isCurrentCardComplete()}
            style={{ flex: 1 }}
          >
            {currentCard === soulCards.length - 1 ? 'Complete Profile' : 'Next Card →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SoulCards
