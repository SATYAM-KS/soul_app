/*
  # Create OTP codes table

  1. New Tables
    - `otp_codes`
      - `id` (uuid, primary key)
      - `phone` (text, phone number)
      - `code` (text, 6-digit OTP code)
      - `verified` (boolean, verification status)
      - `expires_at` (timestamp, expiration time)
      - `created_at` (timestamp, creation time)

  2. Security
    - Enable RLS on `otp_codes` table
    - Add policy for service role access only

  3. Indexes
    - Index on phone and code for fast lookups
    - Index on expires_at for cleanup
*/

CREATE TABLE IF NOT EXISTS otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  code text NOT NULL,
  verified boolean DEFAULT false,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access only
CREATE POLICY "Service role can manage OTP codes"
  ON otp_codes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_otp_codes_phone_code 
  ON otp_codes(phone, code);

CREATE INDEX IF NOT EXISTS idx_otp_codes_expires_at 
  ON otp_codes(expires_at);

-- Add phone column to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone text UNIQUE;
  END IF;
END $$;