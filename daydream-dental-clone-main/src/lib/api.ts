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
  },

  async getCashFlow(customerId?: string) {
    const url = customerId
      ? `${API_BASE_URL}/cashflow?customerId=${customerId}`
      : `${API_BASE_URL}/cashflow`;
    const response = await fetch(url);
    return response.json();
  },

  async getBudget(customerId?: string) {
    const url = customerId
      ? `${API_BASE_URL}/budget?customerId=${customerId}`
      : `${API_BASE_URL}/budget`;
    const response = await fetch(url);
    return response.json();
  },

  async simulateLoan(amount: number, term: number, rate: number) {
    const response = await fetch(
      `${API_BASE_URL}/loansim?amount=${amount}&term=${term}&rate=${rate}`
    );
    return response.json();
  },

  async getLendingReadiness(customerId?: string, revenue?: number) {
    let url = `${API_BASE_URL}/lending`;
    const params = new URLSearchParams();
    if (customerId) params.append('customerId', customerId);
    if (revenue) params.append('revenue', revenue.toString());
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    return response.json();
  }
};
