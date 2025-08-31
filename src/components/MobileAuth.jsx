import React, { useState } from 'react'
import { mobileAuthService } from '../services/mobileAuthService'

function MobileAuth({ onAuthSuccess, onBack }) {
  const [step, setStep] = useState(1) // 1: Mobile, 2: OTP, 3: Check User
  const [mobileNumber, setMobileNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const formatMobileNumber = (number) => {
    const cleaned = number.replace(/\D/g, '')
    if (cleaned.length <= 10) {
      return cleaned
    }
    return cleaned.slice(0, 10)
  }

  const handleMobileSubmit = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formattedNumber = `+91${mobileNumber}`
      await mobileAuthService.sendOTP(formattedNumber)
      setOtpSent(true)
      setStep(2)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formattedNumber = `+91${mobileNumber}`
      const { data } = await mobileAuthService.verifyOTP(formattedNumber, otp)
      
      if (data.user) {
        setStep(3)
        await checkUserStatus(data.user.id)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const checkUserStatus = async (userId) => {
    try {
      const { exists, profile } = await mobileAuthService.checkUserExists(`+91${mobileNumber}`)
      
      if (exists && profile) {
        onAuthSuccess(profile, 'existing')
      } else {
        onAuthSuccess({ mobileNumber: `+91${mobileNumber}`, userId }, 'new')
      }
    } catch (error) {
      console.error('Check user status error:', error)
      onAuthSuccess({ mobileNumber: `+91${mobileNumber}`, userId }, 'new')
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)
    setError('')

    try {
      const formattedNumber = `+91${mobileNumber}`
      await mobileAuthService.sendOTP(formattedNumber)
      setError('')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
      setOtpSent(false)
      setOtp('')
    } else if (step === 1) {
      onBack()
    }
  }

  return (
    <div className="app-container">
      <h1 className="page-title">Welcome to SoulSignal</h1>
      
      <div className="form-container">
        {step === 1 && (
          <>
            <h2>Enter Your Mobile Number</h2>
            <p style={{ color: '#5D5970', marginBottom: '30px', fontSize: '16px' }}>
              We'll send you an OTP to verify your number
            </p>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ 
                  padding: '12px 16px', 
                  background: '#FAD3CB', 
                  borderRadius: '12px',
                  color: '#5D5970',
                  fontWeight: '600'
                }}>
                  +91
                </span>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(formatMobileNumber(e.target.value))}
                  className="form-input"
                  placeholder="9876543210"
                  maxLength="10"
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={handleMobileSubmit}
              disabled={loading || mobileNumber.length !== 10}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            {onBack && (
              <button
                className="btn-secondary"
                onClick={handleBack}
                style={{ marginTop: '15px' }}
              >
                ← Back to Intro
              </button>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <h2>Enter OTP</h2>
            <p style={{ color: '#5D5970', marginBottom: '30px', fontSize: '16px' }}>
              We've sent a 6-digit OTP to +91 {mobileNumber}
            </p>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label className="form-label">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="form-input"
                placeholder="123456"
                maxLength="6"
                style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
              />
            </div>

            <button
              className="btn-primary"
              onClick={handleOTPSubmit}
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              className="btn-secondary"
              onClick={handleResendOTP}
              disabled={loading}
              style={{ marginTop: '15px' }}
            >
              {loading ? 'Sending...' : 'Resend OTP'}
            </button>

            <button
              className="btn-secondary"
              onClick={handleBack}
              style={{ marginTop: '10px' }}
            >
              ← Change Number
            </button>
          </>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <h2>Verifying...</h2>
            <p style={{ color: '#5D5970', marginBottom: '30px' }}>
              Please wait while we check your account
            </p>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #FAD3CB',
              borderTop: '4px solid #5D5970',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MobileAuth
