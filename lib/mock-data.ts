import { ElectricityReading, WaterReading, HeatReading, SolarReading, Profile } from '@/types/database'

export const mockProfiles: Profile[] = [
  {
    id: '1',
    email: 'admin@prosolenergi.dk',
    full_name: 'Admin Bruger',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'guest@prosolenergi.dk',
    full_name: 'Guest Bruger',
    role: 'guest',
    created_at: '2024-02-01T00:00:00Z',
  },
]

export const mockElectricityReadings: ElectricityReading[] = [
  {
    id: '1',
    timestamp: '2024-04-01T00:00:00Z',
    kwh_consumed: 45.2,
    kwh_produced: 12.5,
    kwh_from_grid: 32.7,
    kwh_to_grid: 0,
    price_dkk: 89.5,
    source: 'api',
    created_at: '2024-04-01T00:00:00Z',
  },
  {
    id: '2',
    timestamp: '2024-04-02T00:00:00Z',
    kwh_consumed: 42.1,
    kwh_produced: 15.3,
    kwh_from_grid: 26.8,
    kwh_to_grid: 0,
    price_dkk: 82.3,
    source: 'api',
    created_at: '2024-04-02T00:00:00Z',
  },
  {
    id: '3',
    timestamp: '2024-04-03T00:00:00Z',
    kwh_consumed: 48.5,
    kwh_produced: 18.2,
    kwh_from_grid: 30.3,
    kwh_to_grid: 0,
    price_dkk: 95.2,
    source: 'api',
    created_at: '2024-04-03T00:00:00Z',
  },
]

export const mockWaterReadings: WaterReading[] = [
  { id: '1', year: 2024, month: 1, m3_consumed: 12.5, price_dkk: 125.0, created_at: '2024-02-01T00:00:00Z' },
  { id: '2', year: 2024, month: 2, m3_consumed: 11.2, price_dkk: 112.0, created_at: '2024-03-01T00:00:00Z' },
  { id: '3', year: 2024, month: 3, m3_consumed: 13.8, price_dkk: 138.0, created_at: '2024-04-01T00:00:00Z' },
  { id: '4', year: 2023, month: 1, m3_consumed: 14.2, price_dkk: 142.0, created_at: '2023-02-01T00:00:00Z' },
  { id: '5', year: 2023, month: 2, m3_consumed: 12.9, price_dkk: 129.0, created_at: '2023-03-01T00:00:00Z' },
]

export const mockHeatReadings: HeatReading[] = [
  { id: '1', year: 2024, month: 1, kwh_consumed: 450.2, price_dkk: 1125.5, source_file: 'heat_2024_01.csv', created_at: '2024-02-01T00:00:00Z' },
  { id: '2', year: 2024, month: 2, kwh_consumed: 380.5, price_dkk: 951.25, source_file: 'heat_2024_02.csv', created_at: '2024-03-01T00:00:00Z' },
  { id: '3', year: 2024, month: 3, kwh_consumed: 320.1, price_dkk: 800.25, source_file: 'heat_2024_03.csv', created_at: '2024-04-01T00:00:00Z' },
]

export const mockSolarReadings: SolarReading[] = [
  {
    id: '1',
    timestamp: '2024-04-01T06:00:00Z',
    kwh_produced: 2.5,
    kwh_to_grid: 0.5,
    kwh_from_grid: 0,
    battery_level_pct: 85,
    created_at: '2024-04-01T06:00:00Z',
  },
  {
    id: '2',
    timestamp: '2024-04-01T12:00:00Z',
    kwh_produced: 8.2,
    kwh_to_grid: 3.2,
    kwh_from_grid: 0,
    battery_level_pct: 95,
    created_at: '2024-04-01T12:00:00Z',
  },
  {
    id: '3',
    timestamp: '2024-04-01T18:00:00Z',
    kwh_produced: 3.5,
    kwh_to_grid: 1.5,
    kwh_from_grid: 0,
    battery_level_pct: 75,
    created_at: '2024-04-01T18:00:00Z',
  },
]

// Monthly aggregated data for charts
export const mockMonthlyElectricity = [
  { month: 'Januar', forbrug: 1350, produktion: 180 },
  { month: 'Februar', forbrug: 1280, produktion: 220 },
  { month: 'Marts', forbrug: 1100, produktion: 380 },
  { month: 'April', forbrug: 850, produktion: 520 },
  { month: 'Maj', forbrug: 650, produktion: 680 },
  { month: 'Juni', forbrug: 580, produktion: 750 },
  { month: 'Juli', forbrug: 620, produktion: 720 },
  { month: 'August', forbrug: 680, produktion: 650 },
  { month: 'September', forbrug: 850, produktion: 480 },
  { month: 'Oktober', forbrug: 1050, produktion: 320 },
  { month: 'November', forbrug: 1250, produktion: 200 },
  { month: 'December', forbrug: 1380, produktion: 150 },
]

export const mockMonthlyWater = [
  { month: 'Januar', 2022: 14.2, 2023: 14.5, 2024: 12.5, 2025: 0, 2026: 0 },
  { month: 'Februar', 2022: 13.8, 2023: 12.9, 2024: 11.2, 2025: 0, 2026: 0 },
  { month: 'Marts', 2022: 15.2, 2023: 14.1, 2024: 13.8, 2025: 0, 2026: 0 },
  { month: 'April', 2022: 12.5, 2023: 11.8, 2024: 0, 2025: 0, 2026: 0 },
  { month: 'Maj', 2022: 11.2, 2023: 10.9, 2024: 0, 2025: 0, 2026: 0 },
  { month: 'Juni', 2022: 10.8, 2023: 10.5, 2024: 0, 2025: 0, 2026: 0 },
  { month: 'Juli', 2022: 11.5, 2023: 11.2, 2024: 0, 2025: 0, 2026: 0 },
  { month: 'August', 2022: 12.1, 2023: 11.8, 2024: 0, 2025: 0, 2026: 0 },
  { month: 'September', 2022: 11.9, 2023: 11.5, 2024: 0, 2025: 0, 2026: 0 },
  { month: 'Oktober', 2022: 12.8, 2023: 12.4, 2024: 0, 2025: 0, 2026: 0 },
  { month: 'November', 2022: 13.5, 2023: 13.1, 2024: 0, 2025: 0, 2026: 0 },
  { month: 'December', 2022: 14.2, 2023: 13.8, 2024: 0, 2025: 0, 2026: 0 },
]

export const mockMonthlyHeat = [
  { month: 'Januar', kwh: 450 },
  { month: 'Februar', kwh: 380 },
  { month: 'Marts', kwh: 320 },
  { month: 'April', kwh: 180 },
  { month: 'Maj', kwh: 80 },
  { month: 'Juni', kwh: 40 },
  { month: 'Juli', kwh: 35 },
  { month: 'August', kwh: 50 },
  { month: 'September', kwh: 120 },
  { month: 'Oktober', kwh: 250 },
  { month: 'November', kwh: 380 },
  { month: 'December', kwh: 420 },
]

export const mockMonthlySolar = [
  { month: 'Januar', produktion: 180, eksport: 45, import: 0 },
  { month: 'Februar', produktion: 220, eksport: 55, import: 0 },
  { month: 'Marts', produktion: 380, eksport: 95, import: 0 },
  { month: 'April', produktion: 520, eksport: 130, import: 0 },
  { month: 'Maj', produktion: 680, eksport: 170, import: 0 },
  { month: 'Juni', produktion: 750, eksport: 188, import: 0 },
  { month: 'Juli', produktion: 720, eksport: 180, import: 0 },
  { month: 'August', produktion: 650, eksport: 163, import: 0 },
  { month: 'September', produktion: 480, eksport: 120, import: 0 },
  { month: 'Oktober', produktion: 320, eksport: 80, import: 0 },
  { month: 'November', produktion: 200, eksport: 50, import: 0 },
  { month: 'December', produktion: 150, eksport: 38, import: 0 },
]

export const mockDailySolar = [
  { dag: '1', produktion: 12.5 },
  { dag: '2', produktion: 14.2 },
  { dag: '3', produktion: 11.8 },
  { dag: '4', produktion: 15.3 },
  { dag: '5', produktion: 13.9 },
  { dag: '6', produktion: 16.2 },
  { dag: '7', produktion: 14.5 },
  { dag: '8', produktion: 17.1 },
  { dag: '9', produktion: 15.8 },
  { dag: '10', produktion: 18.3 },
  { dag: '11', produktion: 16.7 },
  { dag: '12', produktion: 19.2 },
  { dag: '13', produktion: 17.5 },
  { dag: '14', produktion: 20.1 },
  { dag: '15', produktion: 18.9 },
]
