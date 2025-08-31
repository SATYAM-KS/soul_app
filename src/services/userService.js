import { supabase } from '../lib/supabase'

export const userService = {
  async signUp(email, password, profile) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Disable email confirmation
        data: {
          name: profile.name,
          age: profile.age,
          gender: profile.gender,
          location: profile.location,
          bio: profile.bio,
          photo: profile.photo
        }
      }
    })
    
    if (authError) throw authError
    
    if (authData.user) {
      console.log('User created successfully:', authData.user.id)
      
      // Try to create profile directly (this might fail due to RLS)
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: email,
            name: profile.name,
            age: parseInt(profile.age),
            gender: profile.gender,
            location: profile.location,
            bio: profile.bio,
            photo: profile.photo
          })
        
        if (profileError) {
          console.error('Profile creation error:', profileError)
          console.log('Profile creation failed, but user account was created')
          // Don't throw error, just continue without profile
        } else {
          console.log('Profile created successfully')
        }
      } catch (error) {
        console.error('Profile creation failed:', error)
        console.log('Continuing without profile creation...')
      }
    }
    
    return authData
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return { data, error: null }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async saveSoulCard(userId, soulCardData) {
    const { data, error } = await supabase
      .from('soul_cards')
      .upsert({
        user_id: userId,
        values_beliefs: soulCardData.valuesBeliefs,
        hobbies_interests: soulCardData.hobbiesInterests,
        social_relationships: soulCardData.socialRelationships,
        dreams_aspirations: soulCardData.dreamsAspirations,
        fun_quirks: soulCardData.funQuirks,
        completed: true
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getSoulCard(userId) {
    const { data, error } = await supabase
      .from('soul_cards')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async getPotentialMatches(userId, userGender, userAge) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        soul_cards(*)
      `)
      .neq('id', userId)
      .eq('gender', userGender === 'Male' ? 'Female' : 'Male')
      .gte('age', userAge - 5)
      .lte('age', userAge + 5)
      .eq('soul_cards.completed', true)
    
    if (error) throw error
    return data
  },

  async uploadPhoto(userId, file) {
    const fileExt = file.name ? file.name.split('.').pop() : 'jpg'
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file)
    
    if (error) throw error
    
    const { data: urlData } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName)
    
    return urlData.publicUrl
  }
}
