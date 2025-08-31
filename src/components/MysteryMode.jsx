import React, { useState, useEffect } from 'react'

function MysteryMode({ userProfile, soulCardAnswers }) {
  const [currentMode, setCurrentMode] = useState('select')
  const [cardMatchProfiles, setCardMatchProfiles] = useState([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [chatPartner, setChatPartner] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    if (currentMode === 'cardMatch') {
      generateCardMatchProfiles()
    } else if (currentMode === 'chatRoulette') {
      findChatPartner()
    }
  }, [currentMode])

  const generateCardMatchProfiles = () => {
    const mockProfiles = [
      {
        id: 1,
        name: 'Alex',
        age: 27,
        soulCards: {
          values: ['Honesty', 'Growth', 'Compassion'],
          hobbies: ['Reading', 'Hiking', 'Cooking'],
          social: ['Trust', 'Quality time', 'Deep conversations'],
          dreams: ['Travel', 'Learn languages', 'Help others'],
          quirks: ['Organize by color', 'Talk to plants', 'Dance while cooking']
        }
      },
      {
        id: 2,
        name: 'Jordan',
        age: 29,
        soulCards: {
          values: ['Authenticity', 'Creativity', 'Balance'],
          hobbies: ['Art', 'Music', 'Yoga'],
          social: ['Empathy', 'Shared experiences', 'Laughter'],
          dreams: ['Art studio', 'Write a book', 'World peace'],
          quirks: ['Sing in the shower', 'Collect rocks', 'Organize by color']
        }
      },
      {
        id: 3,
        name: 'Taylor',
        age: 26,
        soulCards: {
          values: ['Adventure', 'Freedom', 'Connection'],
          hobbies: ['Travel', 'Photography', 'Dancing'],
          social: ['Openness', 'New experiences', 'Genuine connections'],
          dreams: ['World travel', 'Start a business', 'Learn to surf'],
          quirks: ['Talk to strangers', 'Dance anywhere', 'Collect memories']
        }
      }
    ]
    setCardMatchProfiles(mockProfiles)
  }

  const findChatPartner = () => {
    const mockPartner = {
      id: 1,
      name: 'Casey',
      age: 28,
      bio: 'Looking for meaningful connections and great conversations!'
    }
    setChatPartner(mockPartner)
    
    const mockMessages = [
      { id: 1, text: 'Hey there! How are you doing today?', sender: 'partner', timestamp: new Date(Date.now() - 60000) },
      { id: 2, text: 'Hi! I\'m doing great, thanks for asking. How about you?', sender: 'user', timestamp: new Date() }
    ]
    setMessages(mockMessages)
  }

  const handleCardSwipe = (direction) => {
    if (direction === 'like') {
      console.log(`Liked ${cardMatchProfiles[currentCardIndex].name}'s soul card`)
    }
    setCurrentCardIndex(prev => Math.min(prev + 1, cardMatchProfiles.length - 1))
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, message])
      setNewMessage('')
      
      setTimeout(() => {
        const reply = {
          id: messages.length + 2,
          text: 'That sounds interesting! Tell me more about that.',
          sender: 'partner',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, reply])
      }, 1000)
    }
  }

  const resetCardMatch = () => {
    setCurrentCardIndex(0)
  }

  if (currentMode === 'select') {
    return (
      <div className="form-container">
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#5D5970' }}>
          Choose Your Mystery Experience
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="soul-card" onClick={() => setCurrentMode('cardMatch')}>
            <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>🎴 Card Match</h3>
            <p style={{ textAlign: 'center', lineHeight: '1.6' }}>
              Swipe through profiles based only on soul cards. Discover deeper connections through shared values and beliefs.
            </p>
          </div>
          
          <div className="soul-card" onClick={() => setCurrentMode('chatRoulette')}>
            <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>🎲 Chat Roulette</h3>
            <p style={{ textAlign: 'center', lineHeight: '1.6' }}>
              Get instantly connected with someone in your age group for a spontaneous conversation. No profiles, just pure connection.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (currentMode === 'cardMatch') {
    if (currentCardIndex >= cardMatchProfiles.length) {
      return (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>No more soul cards to show!</h2>
          <p style={{ margin: '20px 0', color: '#666' }}>
            You've seen all available soul cards. Check back later for new connections!
          </p>
          <button className="btn-primary" onClick={resetCardMatch}>
            Reset Cards
          </button>
          <button className="btn-secondary" onClick={() => setCurrentMode('select')} style={{ marginTop: '10px' }}>
            Back to Mode Selection
          </button>
        </div>
      )
    }

    const currentProfile = cardMatchProfiles[currentCardIndex]
    const soulCardEntries = Object.entries(currentProfile.soulCards)

    return (
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#5D5970' }}>
          {currentProfile.name}'s Soul Card
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
            Age: {currentProfile.age} • Based on soul compatibility
          </p>
        </div>

        <div style={{ display: 'grid', gap: '16px', marginBottom: '30px' }}>
          {soulCardEntries.map(([category, answers]) => (
            <div key={category} className="soul-card">
              <h4 style={{ marginBottom: '12px', color: '#5D5970' }}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {answers.map((answer, index) => (
                  <li key={index} style={{ 
                    padding: '8px 0', 
                    borderBottom: index < answers.length - 1 ? '1px solid #FAD3CB' : 'none',
                    color: '#5D5970'
                  }}>
                    {answer}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="swipe-buttons">
          <button 
            className="swipe-btn dislike"
            onClick={() => handleCardSwipe('dislike')}
          >
            ❌
          </button>
          
          <button 
            className="swipe-btn like"
            onClick={() => handleCardSwipe('like')}
          >
            ❤️
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button className="btn-secondary" onClick={() => setCurrentMode('select')}>
            Back to Mode Selection
          </button>
        </div>
      </div>
    )
  }

  if (currentMode === 'chatRoulette') {
    return (
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#5D5970' }}>
          Chat Roulette
        </h2>
        
        {chatPartner && (
          <div style={{ textAlign: 'center', marginBottom: '20px', padding: '16px', background: '#FAEBE8', borderRadius: '12px' }}>
            <h3>Connected with {chatPartner.name}</h3>
            <p style={{ color: '#666' }}>Age: {chatPartner.age}</p>
            <p style={{ color: '#666' }}>{chatPartner.bio}</p>
          </div>
        )}

        <div className="chat-container">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.sender === 'user' ? 'sent' : 'received'}`}>
              {message.text}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="form-input"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button className="btn-primary" onClick={sendMessage}>
            Send
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button className="btn-secondary" onClick={() => setCurrentMode('select')}>
            Back to Mode Selection
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default MysteryMode
