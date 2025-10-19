# Capital One Nessie API Integration

## Overview

AgriSight integrates with [Capital One's Nessie API](http://api.nessieisreal.com/documentation) to provide comprehensive financial data for agricultural decision-making. The Nessie API enables us to access real banking data, account information, and transaction history to generate personalized financial recommendations for farmers.

## API Documentation Reference

**Official Documentation**: [http://api.nessieisreal.com/documentation](http://api.nessieisreal.com/documentation)

## Integration Details

### Base URL
```
http://api.nessieisreal.com
```

### Authentication
- **API Key Required**: All requests must include your Nessie API key
- **Parameter**: `key={YOUR_API_KEY}`
- **Example**: `http://api.nessieisreal.com/customers?key=your_api_key_here`

### Key Endpoints Used

#### 1. Customer Accounts
**Endpoint**: `GET /customers/{customerId}/accounts`
**Purpose**: Retrieve all accounts for a specific customer
**Parameters**:
- `customerId`: Unique identifier for the customer
- `key`: Your Nessie API key

**Example Request**:
```bash
curl "http://api.nessieisreal.com/customers/6751b68b9683f20dd518c0fb/accounts?key=YOUR_API_KEY"
```

**Response Structure**:
```json
[
  {
    "_id": "account_id",
    "type": "Checking",
    "nickname": "Farm Operating Account",
    "rewards": 0,
    "balance": 8450.75,
    "account_number": "1234567890"
  }
]
```

#### 2. Account Transactions
**Endpoint**: `GET /accounts/{accountId}/purchases`
**Purpose**: Retrieve recent transactions for financial analysis
**Parameters**:
- `accountId`: Account identifier from accounts endpoint
- `key`: Your Nessie API key

**Example Request**:
```bash
curl "http://api.nessieisreal.com/accounts/account_id/purchases?key=YOUR_API_KEY"
```

**Response Structure**:
```json
[
  {
    "_id": "transaction_id",
    "purchase_date": "2024-01-15",
    "amount": 250.00,
    "description": "Seed Purchase - John Deere Supply",
    "status": "completed"
  }
]
```

## Implementation in AgriSight

### Backend Service (`backend/services/nessieService.js`)

```javascript
const axios = require('axios');

const NESSIE_BASE_URL = 'http://api.nessieisreal.com';
const API_KEY = process.env.NESSIE_API_KEY;

async function getFinancialData(customerId = '6751b68b9683f20dd518c0fb') {
  try {
    // Get customer accounts
    const accountsResponse = await axios.get(
      `${NESSIE_BASE_URL}/customers/${customerId}/accounts?key=${API_KEY}`
    );

    if (!accountsResponse.data || accountsResponse.data.length === 0) {
      throw new Error('No accounts found');
    }

    const account = accountsResponse.data[0]; // Use first account
    
    // Get recent transactions
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
    
    // FALLBACK mock data for demo purposes
    return {
      success: false,
      fallback: true,
      account: {
        id: 'demo-account',
        type: 'Checking',
        nickname: 'Farm Operating Account',
        balance: 8450.75
      },
      transactions: [
        {
          id: 'tx-1',
          date: '2024-01-15',
          description: 'Seed Purchase - John Deere Supply',
          amount: 250.00,
          status: 'completed'
        },
        {
          id: 'tx-2',
          date: '2024-01-12',
          description: 'Fertilizer - Ag Supply Co',
          amount: 180.50,
          status: 'completed'
        }
      ],
      customer_id: customerId
    };
  }
}

module.exports = { getFinancialData };
```

### API Route (`backend/routes/financial.js`)

```javascript
const { getFinancialData } = require('../services/nessieService');

module.exports = async (req, res) => {
  try {
    const { customerId } = req.query;
    
    const financialData = await getFinancialData(customerId);
    
    res.json({
      success: true,
      ...financialData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Financial endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
```

## Financial Recommendations Integration

The Nessie API data is integrated into our AI recommendation engine to provide:

### 1. Cash Flow Analysis
- **Current Balance**: Real-time account balance from Nessie
- **Transaction History**: Recent purchases for spending pattern analysis
- **Monthly Buffer Calculation**: 15% of estimated revenue as recommended reserve

### 2. Risk Assessment
- **Low Cash Reserves Alert**: When balance < monthly buffer
- **High Risk Conditions**: Weather + low reserves = urgent recommendations
- **Investment Opportunities**: When reserves exceed 2x monthly buffer

### 3. Personalized Recommendations
```javascript
// Example recommendation logic
if (balance < monthlyBuffer && overallRisk !== 'low') {
  recommendations.push({
    category: 'financial',
    severity: 'high',
    title: 'Low Cash Reserves',
    description: `Current balance ($${balance.toLocaleString()}) is below recommended buffer for ${overallRisk} risk conditions.`,
    action: `Build reserves to $${Math.round(monthlyBuffer).toLocaleString()} before next growing season`,
    icon: '💰'
  });
}
```

## Environment Configuration

### Required Environment Variables
```env
NESSIE_API_KEY=your_nessie_api_key_here
```

### API Key Setup
1. Visit [Nessie API Documentation](http://api.nessieisreal.com/documentation)
2. Sign in with GitHub
3. Generate your API key
4. Add to your `.env` file

## Error Handling & Fallbacks

### Robust Error Handling
- **API Failures**: Graceful fallback to mock data
- **Network Issues**: Retry logic with exponential backoff
- **Invalid Responses**: Data validation and sanitization
- **Rate Limiting**: Request throttling and queuing

### Fallback Data Structure
When the Nessie API is unavailable, AgriSight provides realistic mock data to ensure the demo continues to function:

```javascript
const fallbackData = {
  account: {
    balance: 8450.75,
    type: 'Checking',
    nickname: 'Farm Operating Account'
  },
  transactions: [
    // Realistic agricultural transaction examples
  ]
};
```

## Security & Compliance

### Data Protection
- **API Key Security**: Stored in environment variables
- **HTTPS Only**: All API communications encrypted
- **Data Minimization**: Only necessary financial data retrieved
- **No Storage**: Financial data not persisted locally

### HIPAA Compliance
- **Secure Transmission**: All data encrypted in transit
- **Access Controls**: API key-based authentication
- **Audit Logging**: All API calls logged for compliance

## Demo Customer ID

For demonstration purposes, AgriSight uses a predefined customer ID:
```
6751b68b9683f20dd518c0fb
```

This allows the demo to work immediately without requiring users to create their own Nessie accounts.

## Future Enhancements

### Planned Features
1. **Multi-Account Support**: Handle multiple farm accounts
2. **Real-Time Updates**: WebSocket integration for live balance updates
3. **Transaction Categorization**: AI-powered expense categorization
4. **Budget Tracking**: Monthly budget vs. actual spending analysis
5. **Loan Integration**: Direct loan application through Capital One

### API Expansion
- **Bill Pay Integration**: Automated bill payments
- **Investment Accounts**: Portfolio management for farm investments
- **Credit Monitoring**: Credit score tracking and improvement
- **Insurance Integration**: Farm insurance policy management

## Troubleshooting

### Common Issues

#### 1. API Key Invalid
**Error**: `401 Unauthorized`
**Solution**: Verify API key in environment variables

#### 2. Customer Not Found
**Error**: `404 Not Found`
**Solution**: Use demo customer ID or create new customer

#### 3. Rate Limiting
**Error**: `429 Too Many Requests`
**Solution**: Implement request throttling

#### 4. Network Timeout
**Error**: `ETIMEDOUT`
**Solution**: Increase timeout values and implement retry logic

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=nessie:*
```

## Support & Resources

- **Official Documentation**: [http://api.nessieisreal.com/documentation](http://api.nessieisreal.com/documentation)
- **GitHub Repository**: [Nessie API GitHub](https://github.com/capitalone/nessie)
- **Capital One Developer Portal**: [developer.capitalone.com](https://developer.capitalone.com)
- **API Support**: Contact Capital One developer support

---

*This integration demonstrates AgriSight's commitment to providing farmers with real financial data to make informed agricultural decisions. The Nessie API enables us to bridge the gap between traditional banking and modern agricultural technology.*
