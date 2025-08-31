# Supabase Setup Guide for SoulSignal

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `soulsignal-dating`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
5. Click "Create new project"

## 2. Get Project Credentials

1. Go to Project Settings > API
2. Copy the following:
   - Project URL
   - Anon (public) key

## 3. Create Environment File

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Database Schema

Run these SQL commands in your Supabase SQL Editor:

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18),
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  location TEXT NOT NULL,
  bio TEXT,
  photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view other profiles for matching" ON profiles
  FOR SELECT USING (true);
```

### Soul Cards Table
```sql
CREATE TABLE soul_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  values_beliefs JSONB NOT NULL,
  hobbies_interests JSONB NOT NULL,
  social_relationships JSONB NOT NULL,
  dreams_aspirations JSONB NOT NULL,
  fun_quirks JSONB NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE soul_cards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own soul card" ON soul_cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own soul card" ON soul_cards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own soul card" ON soul_cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view other soul cards for matching" ON soul_cards
  FOR SELECT USING (true);
```

## 5. Storage Setup

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `profile-photos`
3. Set it to public
4. Add this policy to allow authenticated users to upload:

```sql
CREATE POLICY "Users can upload profile photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-photos' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Profile photos are publicly viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-photos');
```

## 6. Install Dependencies

Run this command in your project directory:

```bash
npm install @supabase/supabase-js
```

## 7. Test the Setup

1. Start your development server: `npm run dev`
2. Try to sign up with a new account
3. Check your Supabase dashboard to see if the user and profile were created

## 8. Troubleshooting

### Common Issues:

1. **CORS Error**: Make sure your Supabase project allows your localhost domain
2. **RLS Policy Error**: Check that your policies are correctly set up
3. **Storage Upload Error**: Verify bucket permissions and policies

### Debug Tips:

- Check browser console for errors
- Use Supabase dashboard to monitor database operations
- Test policies in Supabase SQL editor

## 9. Production Deployment

When deploying to production:

1. Update environment variables with production Supabase credentials
2. Ensure your domain is added to Supabase CORS settings
3. Review and tighten RLS policies if needed
4. Set up proper authentication redirects

## 10. Security Notes

- Never expose your service role key in client-side code
- Use RLS policies to control data access
- Validate all user inputs server-side
- Regularly review and update security policies
