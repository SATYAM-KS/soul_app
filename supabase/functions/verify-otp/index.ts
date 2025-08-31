import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface VerifyRequest {
  phone: string
  code: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone, code }: VerifyRequest = await req.json()

    if (!phone || !code) {
      return new Response(
        JSON.stringify({ error: 'Phone number and code are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check OTP in database
    const { data: otpData, error: otpError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone', phone)
      .eq('code', code)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (otpError || !otpData) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired OTP' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Mark OTP as verified
    const { error: updateError } = await supabase
      .from('otp_codes')
      .update({ verified: true })
      .eq('id', otpData.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to verify OTP' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if user exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', phone)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile check error:', profileError)
    }

    // Create or get user session
    let userId
    if (existingProfile) {
      userId = existingProfile.id
    } else {
      // Create a temporary user ID for new users
      userId = crypto.randomUUID()
    }

    // Generate a session token (you might want to use JWT here)
    const sessionToken = btoa(JSON.stringify({
      userId,
      phone,
      verified: true,
      timestamp: Date.now()
    }))

    return new Response(
      JSON.stringify({ 
        success: true,
        user: {
          id: userId,
          phone,
          exists: !!existingProfile
        },
        profile: existingProfile,
        sessionToken
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})