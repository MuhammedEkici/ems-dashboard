-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'guest')) DEFAULT 'guest',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create electricity_readings table
CREATE TABLE electricity_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  kwh_consumed DECIMAL(10, 2) NOT NULL,
  kwh_produced DECIMAL(10, 2) NOT NULL,
  kwh_from_grid DECIMAL(10, 2) NOT NULL,
  kwh_to_grid DECIMAL(10, 2) NOT NULL,
  price_dkk DECIMAL(10, 2) NOT NULL,
  source TEXT CHECK (source IN ('api', 'manual')) DEFAULT 'manual',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create water_readings table
CREATE TABLE water_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  m3_consumed DECIMAL(10, 2) NOT NULL,
  price_dkk DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, year, month)
);

-- Create heat_readings table
CREATE TABLE heat_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  kwh_consumed DECIMAL(10, 2) NOT NULL,
  price_dkk DECIMAL(10, 2) NOT NULL,
  source_file TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, year, month)
);

-- Create solar_readings table
CREATE TABLE solar_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  kwh_produced DECIMAL(10, 2) NOT NULL,
  kwh_to_grid DECIMAL(10, 2) NOT NULL,
  kwh_from_grid DECIMAL(10, 2) NOT NULL,
  battery_level_pct INTEGER CHECK (battery_level_pct >= 0 AND battery_level_pct <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_electricity_readings_user_id ON electricity_readings(user_id);
CREATE INDEX idx_electricity_readings_timestamp ON electricity_readings(timestamp);
CREATE INDEX idx_water_readings_user_id ON water_readings(user_id);
CREATE INDEX idx_water_readings_year_month ON water_readings(year, month);
CREATE INDEX idx_heat_readings_user_id ON heat_readings(user_id);
CREATE INDEX idx_heat_readings_year_month ON heat_readings(year, month);
CREATE INDEX idx_solar_readings_user_id ON solar_readings(user_id);
CREATE INDEX idx_solar_readings_timestamp ON solar_readings(timestamp);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE electricity_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE heat_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE solar_readings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid()::text = id::text);

-- RLS Policies for electricity_readings
CREATE POLICY "Users can view their own electricity readings" ON electricity_readings
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own electricity readings" ON electricity_readings
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- RLS Policies for water_readings
CREATE POLICY "Users can view their own water readings" ON water_readings
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own water readings" ON water_readings
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- RLS Policies for heat_readings
CREATE POLICY "Users can view their own heat readings" ON heat_readings
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own heat readings" ON heat_readings
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- RLS Policies for solar_readings
CREATE POLICY "Users can view their own solar readings" ON solar_readings
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own solar readings" ON solar_readings
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
