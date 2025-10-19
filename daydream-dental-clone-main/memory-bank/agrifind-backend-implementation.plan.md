<!-- 015528e9-19dc-497d-8cfb-a6ca135a539a 52ed887f-0242-4933-b103-e562b28aec98 -->
# Agrifind Backend Implementation Action Plan

## Phase 1: Backend Foundation Setup

### Step 1.1: Initialize Backend Structure

Create backend directory structure in `daydream-dental-clone-main/backend/`:

- `backend/server.js` - Express server entry point
- `backend/routes/` - API route handlers
- `backend/services/` - Business logic and external API integrations
- `backend/data/` - Mock data and field information
- `backend/images/` - Crop field images storage
- `backend/.env` - Environment variables

**Test Checkpoint**: Directory structure exists and is properly organized.

### Step 1.2: Install Backend Dependencies

Run in `backend/` directory:

```bash
npm init -y
npm install express cors dotenv axios @google/generative-ai
```

**Test Checkpoint**: Run `npm list` to verify all packages installed successfully.

### Step 1.3: Create Environment Configuration

Create `backend/.env` with:

```
GEMINI_API_KEY=your_key
OPENWEATHER_API_KEY=your_key
NESSIE_API_KEY=your_key
GOOGLE_MAPS_API_KEY=your_key
PORT=3001
NODE_ENV=development
```

**Test Checkpoint**: File exists with all API keys populated.

### Step 1.4: Create Express Server Skeleton

Create `backend/server.js`:

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

**Test Checkpoint**:

- Run `node server.js`
- Visit `http://localhost:3001/api/health` in browser
- Should return: `{"status":"ok","timestamp":"..."}`
- **Debug if fails**: Check port availability, verify file path, check Node.js version

---

## Phase 2: Field Data Management

### Step 2.1: Create Field Data Structure

Create `backend/data/fieldsData.js` with 3 Kansas farm fields including your coordinates:

```javascript
module.exports = {
  farm: {
    id: 'kansas-demo-farm',
    name: 'Demo Kansas Farm',
    center: { lat: [YOUR_CENTER_LAT], lng: [YOUR_CENTER_LNG] },
    fields: [
      {
        id: 'field-1',
        name: 'North Field',
        coordinates: { lat: [LAT_1], lng: [LNG_1] },
        area_acres: 45,
        crop_type: 'wheat',
        image_path: 'field1.jpg',
        status: null
      },
      // ... field-2 and field-3
    ]
  }
};
```

**Test Checkpoint**: Verify coordinates match your 3 field image locations.

### Step 2.2: Create Fields API Endpoint

Create `backend/routes/fields.js`:

```javascript
const fieldsData = require('../data/fieldsData');

module.exports = (req, res) => {
  res.json({
    success: true,
    data: fieldsData.farm,
    timestamp: new Date().toISOString()
  });
};
```

Add to `server.js`:

```javascript
app.get('/api/fields', require('./routes/fields'));
```

**Test Checkpoint**:

- Restart server
- Visit `http://localhost:3001/api/fields`
- Should return farm data with 3 fields
- **Debug if fails**: Check require path, verify fieldsData module exports correctly

### Step 2.3: Store Crop Field Images

Place your 3 crop field images in `backend/images/`:

- `field1.jpg`
- `field2.jpg`
- `field3.jpg`

**Test Checkpoint**: All 3 images exist and are readable (check file sizes > 0 bytes).

---

## Phase 3: Gemini AI Image Analysis (HIGHEST PRIORITY)

### Step 3.1: Create Gemini Service

Create `backend/services/geminiService.js`:

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeFieldImage(imagePath, cropType) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const imageBuffer = fs.readFileSync(path.join(__dirname, '../images', imagePath));
    const base64Image = imageBuffer.toString('base64');

    const prompt = `You are an agricultural expert analyzing satellite/aerial imagery of a ${cropType} field. 

Analyze this image and provide:
1. Overall crop health (Excellent/Good/Fair/Poor)
2. Estimated yield compared to average (percentage, e.g., "15% above average" or "20% below average")
3. Visible issues (e.g., dry patches, pest damage, uneven growth, nutrient deficiency)
4. Confidence level in your assessment (0-100%)

Respond in valid JSON format:
{
  "health_status": "Good",
  "yield_estimate": "+15%",
  "issues": ["Minor dry patches in northeast corner", "Overall healthy canopy"],
  "confidence": 78,
  "summary": "Field shows strong growth with minor irrigation concerns"
}`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image
        }
      }
    ]);

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from Gemini response');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    
    return {
      success: true,
      analysis,
      raw_response: responseText,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Gemini analysis error:', error);
    
    return {
      success: false,
      fallback: true,
      analysis: {
        health_status: 'Good',
        yield_estimate: '+10%',
        issues: ['Analysis unavailable - using baseline estimate'],
        confidence: 60,
        summary: 'Field appears healthy based on historical data'
      },
      error: error.message
    };
  }
}

module.exports = { analyzeFieldImage };
```

**Test Checkpoint**: Module created with proper error handling and fallback logic.

### Step 3.2: Create Analysis API Endpoint

Create `backend/routes/analyze.js`:

```javascript
const { analyzeFieldImage } = require('../services/geminiService');
const fieldsData = require('../data/fieldsData');

module.exports = async (req, res) => {
  try {
    const { fieldId } = req.body;
    
    if (!fieldId) {
      return res.status(400).json({ error: 'fieldId required' });
    }

    const field = fieldsData.farm.fields.find(f => f.id === fieldId);
    
    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }

    console.log(`Analyzing ${field.name} (${field.crop_type})...`);
    
    const result = await analyzeFieldImage(field.image_path, field.crop_type);
    
    res.json({
      success: true,
      field_id: fieldId,
      field_name: field.name,
      crop_type: field.crop_type,
      ...result
    });

  } catch (error) {
    console.error('Analysis endpoint error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
```

Add to `server.js`:

```javascript
app.post('/api/analyze', require('./routes/analyze'));
```

**Test Checkpoint**:

- Restart server
- Test with curl or Postman:
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"fieldId": "field-1"}'
```

- Should return analysis with health_status, yield_estimate, issues, confidence
- **Debug if fails**: Check Gemini API key, verify image file exists, check console logs for specific error, verify JSON parsing logic

---

## Phase 4: Weather Integration

### Step 4.1: Create Weather Service

Create `backend/services/weatherService.js`:

```javascript
const axios = require('axios');

async function getWeatherForecast(lat, lon) {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        lat,
        lon,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'imperial',
        cnt: 16
      }
    });

    const forecasts = response.data.list.slice(0, 5).map(item => ({
      date: new Date(item.dt * 1000).toLocaleDateString(),
      temp: Math.round(item.main.temp),
      humidity: item.main.humidity,
      conditions: item.weather[0].main,
      description: item.weather[0].description,
      rain: item.rain ? item.rain['3h'] || 0 : 0,
      icon: item.weather[0].icon
    }));

    const avgTemp = forecasts.reduce((sum, f) => sum + f.temp, 0) / forecasts.length;
    const totalRain = forecasts.reduce((sum, f) => sum + f.rain, 0);
    
    let weatherRisk = 'low';
    let riskReason = 'Weather conditions favorable for crops';
    
    if (avgTemp > 95) {
      weatherRisk = 'high';
      riskReason = 'Extreme heat expected - irrigation critical';
    } else if (totalRain < 0.1) {
      weatherRisk = 'medium';
      riskReason = 'Low rainfall forecast - monitor soil moisture';
    } else if (totalRain > 2) {
      weatherRisk = 'medium';
      riskReason = 'Heavy rainfall expected - watch for flooding';
    }

    return {
      success: true,
      location: { lat, lon },
      forecast: forecasts,
      summary: {
        avg_temp: Math.round(avgTemp),
        total_rain_inches: (totalRain / 25.4).toFixed(2),
        risk_level: weatherRisk,
        risk_reason: riskReason
      }
    };

  } catch (error) {
    console.error('Weather API error:', error);
    
    return {
      success: false,
      fallback: true,
      forecast: [
        { date: 'Today', temp: 78, humidity: 65, conditions: 'Clear', rain: 0 },
        { date: 'Tomorrow', temp: 82, humidity: 70, conditions: 'Partly Cloudy', rain: 0.1 }
      ],
      summary: {
        avg_temp: 80,
        total_rain_inches: 0.1,
        risk_level: 'low',
        risk_reason: 'Conditions appear stable'
      }
    };
  }
}

module.exports = { getWeatherForecast };
```

**Test Checkpoint**: Module created with proper error handling and fallback.

### Step 4.2: Create Weather API Endpoint

Create `backend/routes/weather.js`:

```javascript
const { getWeatherForecast } = require('../services/weatherService');

module.exports = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    const latitude = parseFloat(lat) || 38.5;
    const longitude = parseFloat(lon) || -98.5;
    
    const weather = await getWeatherForecast(latitude, longitude);
    
    res.json({
      ...weather,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

Add to `server.js`:

```javascript
app.get('/api/weather', require('./routes/weather'));
```

**Test Checkpoint**:

- Restart server
- Visit `http://localhost:3001/api/weather?lat=38.5&lon=-98.5`
- Should return forecast array with 5 days and summary with risk assessment
- **Debug if fails**: Check OpenWeather API key, verify API endpoint URL, check rate limits

---

## Phase 5: Financial Data Integration (Nessie)

### Step 5.1: Create Nessie Service

Create `backend/services/nessieService.js`:

```javascript
const axios = require('axios');

const NESSIE_BASE_URL = 'http://api.nessieisreal.com';
const API_KEY = process.env.NESSIE_API_KEY;

async function getFinancialData(customerId = '6751b68b9683f20dd518c0fb') {
  try {
    const accountsResponse = await axios.get(
      `${NESSIE_BASE_URL}/customers/${customerId}/accounts?key=${API_KEY}`
    );

    if (!accountsResponse.data || accountsResponse.data.length === 0) {
      throw new Error('No accounts found');
    }

    const account = accountsResponse.data[0];
    
    const purchasesResponse = await axios.get(
      `${NESSIE_BASE_URL}/accounts/${account._id}/purchases?key=${API_KEY}`
    );

    const transactions = (purchasesResponse.data || []).slice(0, 5).map(t => ({
      id: t._id,
      date: t.purchase_date,
      description: t.description,
      amount: t.amount,
      status: t.status
    }));

    return {
      success: true,
      account: {
        id: account._id,
        type: account.type,
        nickname: account.nickname || 'Farm Operating Account',
        balance: account.balance
      },
      transactions,
      customer_id: customerId
    };

  } catch (error) {
    console.error('Nessie API error:', error);
    
    return {
      success: false,
      fallback: true,
      account: {
        id: 'mock-account',
        type: 'Checking',
        nickname: 'Farm Operating Account',
        balance: 8450.75
      },
      transactions: [
        { date: '2025-10-15', description: 'Fertilizer Supply Co.', amount: -245.00 },
        { date: '2025-10-12', description: 'Equipment Rental', amount: -180.00 },
        { date: '2025-10-10', description: 'Crop Sales Deposit', amount: 1200.00 },
        { date: '2025-10-08', description: 'Seed Purchase', amount: -890.00 },
        { date: '2025-10-05', description: 'Fuel & Supplies', amount: -125.50 }
      ]
    };
  }
}

module.exports = { getFinancialData };
```

**Test Checkpoint**: Module created with fallback data for reliability.

### Step 5.2: Create Financial API Endpoint

Create `backend/routes/financial.js`:

```javascript
const { getFinancialData } = require('../services/nessieService');

module.exports = async (req, res) => {
  try {
    const { customerId } = req.query;
    
    const financial = await getFinancialData(customerId);
    
    res.json({
      ...financial,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

Add to `server.js`:

```javascript
app.get('/api/financial', require('./routes/financial'));
```

**Test Checkpoint**:

- Restart server
- Visit `http://localhost:3001/api/financial`
- Should return account balance and transactions (either real or fallback)
- **Debug if fails**: Check Nessie API key, verify customer ID exists, confirm fallback data works

---

## Phase 6: AI Recommendation Engine

### Step 6.1: Create Recommendation Service

Create `backend/services/recommendationService.js`:

```javascript
function generateRecommendations(cropAnalysis, weatherData, financialData) {
  const recommendations = [];
  let overallRisk = 'low';
  let recommendedAction = '';
  let estimatedRevenue = 0;
  
  const yieldMatch = cropAnalysis.yield_estimate.match(/([+-])(\d+)%/);
  const yieldChange = yieldMatch ? parseInt(yieldMatch[1] + yieldMatch[2]) : 0;
  
  const baseRevenuePerAcre = 500;
  const totalAcres = 135;
  estimatedRevenue = baseRevenuePerAcre * totalAcres * (1 + yieldChange / 100);
  
  // CROP HEALTH ASSESSMENT
  if (cropAnalysis.health_status === 'Poor' || yieldChange < -15) {
    overallRisk = 'high';
    recommendations.push({
      category: 'crop_health',
      severity: 'high',
      title: 'Crop Stress Detected - Financial Preparation Needed',
      description: `${cropAnalysis.summary}. Yield projected ${yieldChange}% below average.`,
      action: 'Consider applying for emergency operating loan ($5,000-$10,000)',
      icon: '⚠️'
    });
    recommendedAction = 'apply_for_loan';
    
  } else if (cropAnalysis.health_status === 'Fair' || yieldChange < 0) {
    overallRisk = overallRisk === 'low' ? 'medium' : overallRisk;
    recommendations.push({
      category: 'crop_health',
      severity: 'medium',
      title: 'Below-Average Yield Expected',
      description: `Crop health is fair. Estimated yield ${yieldChange}% below normal.`,
      action: 'Reduce non-essential spending and save extra $300/week',
      icon: '⚠️'
    });
    recommendedAction = 'save_more';
    
  } else {
    recommendations.push({
      category: 'crop_health',
      severity: 'low',
      title: 'Healthy Crops - Strong Yield Projected',
      description: `Excellent crop health! Estimated yield ${yieldChange}% above average.`,
      action: 'Maintain current financial plan. Consider equipment investment.',
      icon: '✅'
    });
    recommendedAction = 'maintain_or_invest';
  }
  
  // WEATHER RISK ASSESSMENT
  if (weatherData.summary.risk_level === 'high') {
    overallRisk = 'high';
    recommendations.push({
      category: 'weather',
      severity: 'high',
      title: 'Weather Risk Identified',
      description: weatherData.summary.risk_reason,
      action: 'Set aside $500-$1000 for potential irrigation or storm recovery costs',
      icon: '🌡️'
    });
    
  } else if (weatherData.summary.risk_level === 'medium') {
    overallRisk = overallRisk === 'low' ? 'medium' : overallRisk;
    recommendations.push({
      category: 'weather',
      severity: 'medium',
      title: 'Weather Monitoring Required',
      description: weatherData.summary.risk_reason,
      action: 'Monitor forecasts daily. Budget $200-$500 for contingency.',
      icon: '☁️'
    });
  }
  
  // FINANCIAL HEALTH ASSESSMENT
  const balance = financialData.account.balance;
  const monthlyBuffer = estimatedRevenue * 0.15;
  
  if (balance < monthlyBuffer && overallRisk !== 'low') {
    recommendations.push({
      category: 'financial',
      severity: 'high',
      title: 'Low Cash Reserves',
      description: `Current balance ($${balance.toLocaleString()}) is below recommended buffer for ${overallRisk} risk conditions.`,
      action: `Build reserves to $${Math.round(monthlyBuffer).toLocaleString()} before next growing season`,
      icon: '💰'
    });
    
  } else if (balance > monthlyBuffer * 2 && overallRisk === 'low') {
    recommendations.push({
      category: 'financial',
      severity: 'low',
      title: 'Strong Financial Position',
      description: 'Your cash reserves exceed recommended levels.',
      action: 'Consider investing in efficiency improvements or expansion',
      icon: '📈'
    });
  }
  
  // OVERALL SUMMARY
  let summaryText = '';
  if (overallRisk === 'high') {
    summaryText = `Based on current crop health and weather conditions, we recommend conservative financial management. Estimated revenue: $${Math.round(estimatedRevenue).toLocaleString()}.`;
  } else if (overallRisk === 'medium') {
    summaryText = `Conditions are mixed. Monitor closely and maintain financial flexibility. Estimated revenue: $${Math.round(estimatedRevenue).toLocaleString()}.`;
  } else {
    summaryText = `Favorable conditions detected! Strong yield expected. Estimated revenue: $${Math.round(estimatedRevenue).toLocaleString()}.`;
  }
  
  return {
    overall_risk: overallRisk,
    recommended_action: recommendedAction,
    estimated_revenue: Math.round(estimatedRevenue),
    summary: summaryText,
    recommendations,
    confidence: cropAnalysis.confidence || 75,
    generated_at: new Date().toISOString()
  };
}

module.exports = { generateRecommendations };
```

**Test Checkpoint**: Module created with comprehensive recommendation logic.

### Step 6.2: Create Recommendation API Endpoint

Create `backend/routes/recommend.js`:

```javascript
const { generateRecommendations } = require('../services/recommendationService');

module.exports = async (req, res) => {
  try {
    const { cropAnalysis, weatherData, financialData } = req.body;
    
    if (!cropAnalysis || !weatherData || !financialData) {
      return res.status(400).json({ 
        error: 'Missing required data: cropAnalysis, weatherData, financialData' 
      });
    }
    
    const recommendations = generateRecommendations(
      cropAnalysis,
      weatherData,
      financialData
    );
    
    res.json({
      success: true,
      ...recommendations
    });

  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: error.message });
  }
};
```

Add to `server.js`:

```javascript
app.post('/api/recommend', require('./routes/recommend'));
```

**Test Checkpoint**:

- Restart server
- Test with full data flow using curl:
```bash
curl -X POST http://localhost:3001/api/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "cropAnalysis": {
      "health_status": "Good",
      "yield_estimate": "+10%",
      "issues": ["Minor dry patches"],
      "confidence": 78,
      "summary": "Field shows strong growth"
    },
    "weatherData": {
      "summary": {
        "risk_level": "low",
        "risk_reason": "Weather stable"
      }
    },
    "financialData": {
      "account": {
        "balance": 8450.75
      }
    }
  }'
```

- Should return recommendations array with overall_risk, estimated_revenue, and summary
- **Debug if fails**: Check JSON structure matches expected format, verify all required fields present

---

## Phase 7: Frontend Integration

### Step 7.1: Create Frontend API Service

Create `daydream-dental-clone-main/src/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = {
  async getFields() {
    const response = await fetch(`${API_BASE_URL}/fields`);
    return response.json();
  },
  
  async analyzeField(fieldId: string) {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fieldId })
    });
    return response.json();
  },
  
  async getWeather(lat: number, lon: number) {
    const response = await fetch(`${API_BASE_URL}/weather?lat=${lat}&lon=${lon}`);
    return response.json();
  },
  
  async getFinancial(customerId?: string) {
    const url = customerId 
      ? `${API_BASE_URL}/financial?customerId=${customerId}`
      : `${API_BASE_URL}/financial`;
    const response = await fetch(url);
    return response.json();
  },
  
  async getRecommendations(cropAnalysis: any, weatherData: any, financialData: any) {
    const response = await fetch(`${API_BASE_URL}/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cropAnalysis, weatherData, financialData })
    });
    return response.json();
  }
};
```

**Test Checkpoint**: File created with proper TypeScript types and API methods.

### Step 7.2: Add Environment Variable for Frontend

Create/update `daydream-dental-clone-main/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_key
```

**Test Checkpoint**: Environment variables set correctly.

### Step 7.3: Update Dashboard Components to Use Real Data

Modify existing dashboard components to integrate with backend API instead of mock data. Start with `PlotGrid` component to trigger analysis and display results.

**Test Checkpoint**:

- Start both servers (backend: `node server.js`, frontend: `npm run dev`)
- Click analyze button on dashboard
- Verify API calls succeed in browser network tab
- Verify data displays correctly in UI
- **Debug if fails**: Check CORS settings, verify API URL is correct, check browser console for errors

---

## Phase 8: End-to-End Testing & Polish

### Step 8.1: Full Integration Test

Test complete flow:

1. Frontend loads and displays 3 fields
2. Click "Analyze" on field-1
3. Backend calls Gemini API
4. Backend fetches weather data
5. Backend fetches financial data
6. Backend generates recommendations
7. Frontend displays all results

**Test Checkpoint**: Complete user flow works without errors from start to finish.

### Step 8.2: Test All 3 Fields

Analyze all 3 fields individually to ensure:

- Different images analyzed correctly
- Different crop types handled properly
- Recommendations vary based on analysis

**Test Checkpoint**: All 3 fields can be analyzed successfully.

### Step 8.3: Error Handling Verification

Test error scenarios:

- Invalid field ID
- Network timeout
- API key failure (temporarily use wrong key)
- Verify fallback data displays properly

**Test Checkpoint**: App gracefully handles errors and shows fallback data.

### Step 8.4: Performance & Loading States

Verify:

- Loading spinners display during API calls
- No blocking UI during analysis
- Reasonable response times (< 5 seconds for analysis)

**Test Checkpoint**: User experience is smooth with proper feedback.

---

## Success Criteria

Core MVP Complete when:

- Backend server runs without errors
- All 5 API endpoints functional (`/health`, `/fields`, `/analyze`, `/weather`, `/financial`, `/recommend`)
- At least 1 field can be analyzed end-to-end
- Gemini successfully analyzes crop images (or fallback works)
- Weather data displays correctly
- Financial data displays correctly
- AI recommendations generate and display properly
- Frontend successfully communicates with backend

## Debug Priority Order

If issues arise, debug in this priority:

1. Backend server won't start - Check Node.js, port conflicts, syntax errors
2. Gemini analysis fails - Verify API key, check image paths, test fallback
3. Frontend can't reach backend - Check CORS, verify URL, check network tab
4. Data not displaying - Check component state management, verify API response structure
5. Recommendations not generating - Check input data format, verify calculation logic

### To-dos

- [ ] Phase 1: Backend Foundation Setup - Create directory structure, install dependencies, configure environment, and create Express server skeleton
- [ ] Phase 2: Field Data Management - Create field data structure with coordinates, implement fields API endpoint, store crop images
- [ ] Phase 3: Gemini AI Image Analysis - Create Gemini service with image analysis logic, implement analysis API endpoint, test with real crop images
- [ ] Phase 4: Weather Integration - Create weather service with OpenWeather API, implement weather endpoint with risk assessment
- [ ] Phase 5: Financial Data Integration - Create Nessie service, implement financial endpoint with account and transaction data
- [ ] Phase 6: AI Recommendation Engine - Create recommendation service combining crop/weather/financial data, implement recommendation endpoint
- [ ] Phase 7: Frontend Integration - Create frontend API service, configure environment variables, update dashboard components to use real backend data
- [ ] Phase 8: End-to-End Testing & Polish - Test full integration flow, verify all 3 fields work, validate error handling, optimize performance