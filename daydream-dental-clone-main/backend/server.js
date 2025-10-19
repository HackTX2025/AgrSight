const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Load routes conditionally to avoid startup crashes
try {
  app.get('/api/fields', require('./routes/fields'));
  console.log('✅ Fields route loaded');
} catch (error) {
  console.error('❌ Fields route failed:', error.message);
}

try {
  app.post('/api/analyze', require('./routes/analyze'));
  console.log('✅ Analyze route loaded');
} catch (error) {
  console.error('❌ Analyze route failed:', error.message);
}

try {
  app.get('/api/weather', require('./routes/weather'));
  console.log('✅ Weather route loaded');
} catch (error) {
  console.error('❌ Weather route failed:', error.message);
}

try {
  app.get('/api/financial', require('./routes/financial'));
  console.log('✅ Financial route loaded');
} catch (error) {
  console.error('❌ Financial route failed:', error.message);
}

try {
  app.post('/api/recommend', require('./routes/recommend'));
  console.log('✅ Recommend route loaded');
} catch (error) {
  console.error('❌ Recommend route failed:', error.message);
}

// New finance routes
try {
  app.get('/api/cashflow', require('./routes/cashflow'));
  console.log('✅ Cashflow route loaded');
} catch (error) {
  console.error('❌ Cashflow route failed:', error.message);
}

try {
  app.get('/api/budget', require('./routes/budget'));
  console.log('✅ Budget route loaded');
} catch (error) {
  console.error('❌ Budget route failed:', error.message);
}

try {
  app.get('/api/loansim', require('./routes/loansim'));
  console.log('✅ Loan simulator route loaded');
} catch (error) {
  console.error('❌ Loan simulator route failed:', error.message);
}

try {
  app.get('/api/lending', require('./routes/lending'));
  console.log('✅ Lending readiness route loaded');
} catch (error) {
  console.error('❌ Lending readiness route failed:', error.message);
}

<<<<<<< Updated upstream
<<<<<<< Updated upstream
// Financial actions (loans, payments, transactions)
try {
  app.post('/api/actions', require('./routes/actions'));
  console.log('✅ Financial actions route loaded');
} catch (error) {
  console.error('❌ Financial actions route failed:', error.message);
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
=======
=======
>>>>>>> Stashed changes
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> Stashed changes
