const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeFieldWithData(fieldData, ndvi, weatherData) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `You are a Capital One agricultural financial advisor. Analyze crop data and provide CONCISE, ACTIONABLE financial recommendations.

**DATA:**
- ${fieldData.crop_type} field, ${fieldData.area_acres} acres
- NDVI: ${ndvi} (>0.6=healthy, 0.3-0.6=moderate, <0.3=poor)
- Weather: ${weatherData.summary?.avg_temp || 'N/A'}°F, ${weatherData.summary?.total_rain_inches || 'N/A'}" rain, Risk: ${weatherData.summary?.risk_level || 'low'}

**RESPOND WITH JSON (keep ALL text SHORT):**
{
  "health_status": "Excellent/Good/Fair/Poor",
  "yield_estimate": "+15%",
  "confidence": 85,
  "summary": "ONE sentence max",
  "financial_impact": "ONE sentence on revenue impact",
  "recommended_actions": [
    "Action with $ amount (Capital One loan/credit card)",
    "Action with $ amount",
    "Action with $ amount"
  ]
}

**RULES:**
- Keep summary under 15 words
- Keep financial_impact under 15 words
- ONLY 2-3 actions, each under 20 words
- Every action must mention specific $ amounts
- Prioritize Capital One products (loans, credit cards, savings)`;

    const result = await model.generateContent(prompt);

    const responseText = result.response.text();
    console.log('Gemini raw response:', responseText);

    // Try to extract JSON from the response
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
    console.error('Gemini analysis error:', error.message);

    // Intelligent fallback based on NDVI
    let health_status = 'Good';
    let yield_estimate = '+10%';
    let financial_impact = 'Stable revenue expected';
    let recommended_actions = ['Maintain $3,000 emergency fund', 'Review Capital One savings options'];

    if (ndvi >= 0.6) {
      health_status = 'Good';
      yield_estimate = '+12%';
      financial_impact = 'Strong yields - positive revenue outlook';
      recommended_actions = ['Consider $15,000 Capital One expansion loan', 'Save $1,000/month in high-yield account'];
    } else if (ndvi >= 0.3) {
      health_status = 'Fair';
      yield_estimate = '-5%';
      financial_impact = 'Moderate yields - income may drop 5-10%';
      recommended_actions = ['Apply for $8,000 Capital One operating line', 'Cut non-essential expenses by $500/month'];
    } else {
      health_status = 'Poor';
      yield_estimate = '-20%';
      financial_impact = 'Significant loss expected - $5,000-$10,000 impact';
      recommended_actions = ['Urgent: Apply for $10,000 Capital One emergency loan', 'Defer equipment purchases, save $1,500/month'];
    }

    // Adjust for weather risk
    if (weatherData.summary?.risk_level === 'high') {
      recommended_actions[0] = 'Urgent: ' + recommended_actions[0];
    }

    return {
      success: false,
      fallback: true,
      analysis: {
        health_status,
        yield_estimate,
        issues,
        confidence: 65,
        summary: `Field appears ${health_status.toLowerCase()} based on NDVI data (${ndvi.toFixed(2)})`,
        financial_impact,
        recommended_actions
      },
      error: error.message
    };
  }
}

module.exports = { analyzeFieldWithData };
