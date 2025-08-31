// Twilio service for SMS functionality
// Note: This is a client-side service that calls our Supabase edge functions

export const twilioService = {
  async sendSMS(to, message) {
    try {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: { to, message }
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('SMS send error:', error)
      throw new Error('Failed to send SMS')
    }
  },

  async sendOTPSMS(phone, otp) {
    const message = `Your SoulSignal verification code is: ${otp}. This code expires in 5 minutes.`
    return this.sendSMS(phone, message)
  }
}