import { supabase } from '../lib/supabase'

export const mobileAuthService = {
  async sendOTP(mobileNumber) {
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phone: mobileNumber }
      })
      
      if (error) throw error
      if (data.error) throw new Error(data.error)
      return { success: true, data }
    } catch (error) {
      console.error('OTP send error:', error)
      throw new Error('Failed to send OTP. Please try again.')
    }
  },

  async verifyOTP(mobileNumber, otp) {
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { phone: mobileNumber, code: otp }
      })
      
      if (error) throw error
      if (data.error) throw new Error(data.error)
      return { success: true, data }
    } catch (error) {
      console.error('OTP verify error:', error)
      throw new Error('Invalid OTP. Please try again.')
    }
  },

  async checkUserExists(mobileNumber) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', mobileNumber)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return { exists: !!data, profile: data }
    } catch (error) {
      console.error('Check user error:', error)
      return { exists: false, profile: null }
    }
  },

  async createUserProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          phone: profileData.mobileNumber,
          name: profileData.name,
          email: profileData.email,
          age: parseInt(profileData.age),
          gender: profileData.gender,
          location: profileData.location,
          bio: profileData.bio,
          photo: profileData.photo,
          created_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Create profile error:', error)
      throw new Error('Failed to create profile')
    }
  },

  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Get profile error:', error)
      throw new Error('Failed to get profile')
    }
  },

  async saveSoulCard(userId, soulCardData) {
    try {
      const { data, error } = await supabase
        .from('soul_cards')
        .upsert({
          user_id: userId,
          values_beliefs: soulCardData.valuesBeliefs,
          hobbies_interests: soulCardData.hobbiesInterests,
          social_relationships: soulCardData.socialRelationships,
          dreams_aspirations: soulCardData.dreamsAspirations,
          fun_quirks: soulCardData.funQuirks,
          completed: true,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Save soul card error:', error)
      throw new Error('Failed to save soul card')
    }
  },

  async getSoulCard(userId) {
    try {
      const { data, error } = await supabase
        .from('soul_cards')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.error('Get soul card error:', error)
      return null
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }
}
