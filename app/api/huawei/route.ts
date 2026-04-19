import { NextResponse } from 'next/server'

// TODO: Phase 2 — Huawei FusionSolar API Integration
// Docs: https://support.huawei.com/enterprise/en/doc/EDOC1100261860
// Base URL: https://eu5.fusionsolar.huawei.com/thirdData/
//
// Authentication flow:
// 1. POST /thirdData/login with { userName, systemCode }
// 2. Use returned xsrf-token in subsequent requests
// 3. GET /thirdData/getStationList — list all plants
// 4. POST /thirdData/getKpiInfo — get real-time KPIs
// 5. POST /thirdData/getDevRealKpi — get device-level data
//
// Credentials stored in:
// HUAWEI_FUSION_USER=your_username_here
// HUAWEI_FUSION_PASS=your_password_here

export async function GET() {
  return NextResponse.json({
    status: 'placeholder',
    message: 'Huawei FusionSolar integration er planlagt til Phase 2',
    credentials_configured: !!(
      process.env.HUAWEI_FUSION_USER &&
      process.env.HUAWEI_FUSION_USER !== 'your_username_here'
    ),
    endpoints_to_implement: [
      'POST /thirdData/login',
      'GET /thirdData/getStationList',
      'POST /thirdData/getKpiInfo',
      'POST /thirdData/getDevRealKpi',
    ],
  })
}
