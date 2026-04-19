export type Profile = {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'guest'
  created_at: string
}

export type ElectricityReading = {
  id: string
  timestamp: string
  kwh_consumed: number
  kwh_produced: number
  kwh_from_grid: number
  kwh_to_grid: number
  price_dkk: number
  source: 'api' | 'manual'
  created_at: string
}

export type WaterReading = {
  id: string
  year: number
  month: number
  m3_consumed: number
  price_dkk: number
  created_at: string
}

export type HeatReading = {
  id: string
  year: number
  month: number
  kwh_consumed: number
  price_dkk: number
  source_file: string
  created_at: string
}

export type SolarReading = {
  id: string
  timestamp: string
  kwh_produced: number
  kwh_to_grid: number
  kwh_from_grid: number
  battery_level_pct: number
  created_at: string
}
