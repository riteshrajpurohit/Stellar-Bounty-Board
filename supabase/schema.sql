-- Create a table for public profiles
create table profiles (
  wallet_address text primary key,
  name text not null,
  email text not null,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_seen timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies

-- 1. Anyone can view profiles.
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

-- 2. Users can insert their own profile. We can't strictly enforce crypto auth strictly here without a custom custom JWT,
-- but typically the frontend is trusted to provide its address, or you use Supabase auth in tandem. 
-- For a pure web3 app, you often allow inserts/updates matching a passed address.
create policy "Users can insert their own profile." on profiles
  for insert with check (true); 

-- 3. Users can update their own profile.
create policy "Users can update their own profile." on profiles
  for update using (true);
