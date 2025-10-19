function generateRecommendations(cropAnalysis, weatherData, financialData, fieldData = null) {
  const recommendations = [];
  let overallRisk = 'low';
  let recommendedAction = '';
  let estimatedRevenue = 0;

  const yieldMatch = cropAnalysis.yield_estimate.match(/([+-])(\d+)%/);
  const yieldChange = yieldMatch ? parseInt(yieldMatch[1] + yieldMatch[2]) : 0;

  // PRECISE CALCULATION: Use actual field data from fieldsData.js
  // Field-1: 48 acres wheat @ $420/acre, Field-2: 54 acres corn @ $580/acre, Field-3: 43 acres soybeans @ $510/acre
  const cropPrices = {
    wheat: 420,    // per acre
    corn: 580,     // per acre
    soybeans: 510  // per acre
  };

  let totalAcres = 145; // 48 + 54 + 43
  let baseRevenuePerAcre = 500; // Default average

  // If we have specific field data, calculate precisely
  if (fieldData && fieldData.crop_type && fieldData.area_acres) {
    baseRevenuePerAcre = cropPrices[fieldData.crop_type] || 500;
    totalAcres = fieldData.area_acres;
    estimatedRevenue = baseRevenuePerAcre * totalAcres * (1 + yieldChange / 100);
  } else {
    // Calculate for all 3 fields
    const wheatRevenue = cropPrices.wheat * 48 * (1 + yieldChange / 100);
    const cornRevenue = cropPrices.corn * 54 * (1 + yieldChange / 100);
    const soybeanRevenue = cropPrices.soybeans * 43 * (1 + yieldChange / 100);
    estimatedRevenue = wheatRevenue + cornRevenue + soybeanRevenue;
  }

  // CROP HEALTH ASSESSMENT
  if (cropAnalysis.health_status === 'Poor' || yieldChange < -15) {
    overallRisk = 'high';

    // Calculate specific loan amount needed
    const expectedRevenue = baseRevenuePerAcre * totalAcres;
    const actualRevenue = estimatedRevenue;
    const revenueLoss = expectedRevenue - actualRevenue;
    const recommendedLoan = Math.round(revenueLoss * 0.6); // 60% of loss coverage

    recommendations.push({
      category: 'crop_health',
      severity: 'high',
      title: 'Crop Stress Detected - Financial Preparation Needed',
      description: `${cropAnalysis.summary}. Yield projected ${yieldChange}% below average. Expected revenue loss: $${Math.round(revenueLoss).toLocaleString()}.`,
      action: `Apply for emergency operating loan: $${recommendedLoan.toLocaleString()} (4.5% APR, 12-month term)`,
      icon: '⚠️',
      loanDetails: {
        amount: recommendedLoan,
        purpose: 'Emergency Operating Loan',
        interestRate: 4.5,
        term: 12
      }
    });
    recommendedAction = 'apply_for_loan';

  } else if (cropAnalysis.health_status === 'Fair' || yieldChange < 0) {
    overallRisk = overallRisk === 'low' ? 'medium' : overallRisk;

    // Calculate specific savings needed
    const expectedRevenue = baseRevenuePerAcre * totalAcres;
    const shortfall = expectedRevenue - estimatedRevenue;
    const weeklySavings = Math.round((shortfall / 12) / 4); // Spread over 3 months, 4 weeks/month

    recommendations.push({
      category: 'crop_health',
      severity: 'medium',
      title: 'Below-Average Yield Expected',
      description: `Crop health is fair. Estimated yield ${yieldChange}% below normal. Projected shortfall: $${Math.round(shortfall).toLocaleString()}.`,
      action: `Build cash reserves: Save $${weeklySavings.toLocaleString()}/week for next 12 weeks`,
      icon: '⚠️',
      savingsGoal: {
        weeklyAmount: weeklySavings,
        totalWeeks: 12,
        targetAmount: weeklySavings * 12
      }
    });
    recommendedAction = 'save_more';

  } else {
    // Calculate surplus
    const expectedRevenue = baseRevenuePerAcre * totalAcres;
    const surplus = estimatedRevenue - expectedRevenue;

    recommendations.push({
      category: 'crop_health',
      severity: 'low',
      title: 'Healthy Crops - Strong Yield Projected',
      description: `Excellent crop health! Estimated yield ${yieldChange}% above average. Projected surplus: $${Math.round(surplus).toLocaleString()}.`,
      action: surplus > 5000
        ? `Consider investing $${Math.round(surplus * 0.4).toLocaleString()} in equipment upgrades or field expansion`
        : 'Maintain current financial plan and build reserves',
      icon: '✅',
      investmentOpportunity: surplus > 5000 ? {
        amount: Math.round(surplus * 0.4),
        suggestion: 'Precision irrigation system or soil testing equipment'
      } : null
    });
    recommendedAction = 'maintain_or_invest';
  }

  // WEATHER RISK ASSESSMENT
  if (weatherData.summary.risk_level === 'high') {
    overallRisk = 'high';

    // Calculate weather-related costs
    const irrigationCostPerAcre = 15; // $15/acre for emergency irrigation
    const weatherContingency = Math.round(totalAcres * irrigationCostPerAcre);

    recommendations.push({
      category: 'weather',
      severity: 'high',
      title: 'Weather Risk Identified',
      description: `${weatherData.summary.risk_reason}. ${totalAcres} acres at risk.`,
      action: `Set aside $${weatherContingency.toLocaleString()} for irrigation ($${irrigationCostPerAcre}/acre) or storm recovery. Transfer to emergency fund immediately.`,
      icon: '🌡️',
      weatherContingency: {
        amount: weatherContingency,
        perAcreCost: irrigationCostPerAcre,
        affectedAcres: totalAcres,
        timeframe: '7-14 days'
      }
    });

  } else if (weatherData.summary.risk_level === 'medium') {
    overallRisk = overallRisk === 'low' ? 'medium' : overallRisk;

    const contingencyAmount = Math.round(totalAcres * 5); // $5/acre buffer

    recommendations.push({
      category: 'weather',
      severity: 'medium',
      title: 'Weather Monitoring Required',
      description: `${weatherData.summary.risk_reason}. Keep ${totalAcres} acres monitored.`,
      action: `Budget $${contingencyAmount.toLocaleString()} contingency fund. Monitor forecasts daily via NOAA or local extension office.`,
      icon: '☁️',
      weatherContingency: {
        amount: contingencyAmount,
        monitoringTools: ['NOAA Weather Radio', 'Local Extension Office', 'Farm Weather Apps']
      }
    });
  }

  // FINANCIAL HEALTH ASSESSMENT
  const balance = financialData.account.balance;
  const monthlyOperatingCost = estimatedRevenue * 0.12; // 12% of revenue for operations
  const recommendedBuffer = monthlyOperatingCost * 3; // 3 months operating expenses

  // Check for existing loans
  const totalDebt = financialData.loans
    ? financialData.loans.reduce((sum, loan) => sum + loan.balance, 0)
    : 0;
  const monthlyDebtPayments = financialData.loans
    ? financialData.loans.filter(l => l.status === 'active').reduce((sum, loan) => sum + loan.monthlyPayment, 0)
    : 0;

  // Debt-to-income ratio
  const debtToIncomeRatio = (monthlyDebtPayments * 12) / estimatedRevenue;

  if (balance < recommendedBuffer && overallRisk !== 'low') {
    const deficit = recommendedBuffer - balance;

    recommendations.push({
      category: 'financial',
      severity: 'high',
      title: 'Low Cash Reserves',
      description: `Current balance ($${balance.toLocaleString()}) is $${Math.round(deficit).toLocaleString()} below recommended 3-month buffer for ${overallRisk} risk conditions. Monthly operating cost: $${Math.round(monthlyOperatingCost).toLocaleString()}.`,
      action: `Priority: Build emergency fund to $${Math.round(recommendedBuffer).toLocaleString()}. Reduce discretionary spending by $${Math.round(deficit / 12).toLocaleString()}/month.`,
      icon: '💰',
      financialTarget: {
        currentBalance: balance,
        targetBalance: Math.round(recommendedBuffer),
        monthsToTarget: Math.ceil(deficit / (deficit / 12)),
        monthlySavingsNeeded: Math.round(deficit / 6) // 6 months to build buffer
      }
    });

  } else if (balance > recommendedBuffer * 2 && overallRisk === 'low') {
    const excess = balance - recommendedBuffer * 2;

    recommendations.push({
      category: 'financial',
      severity: 'low',
      title: 'Strong Financial Position',
      description: `Your cash reserves ($${balance.toLocaleString()}) exceed recommended levels by $${Math.round(excess).toLocaleString()}. Debt-to-income ratio: ${(debtToIncomeRatio * 100).toFixed(1)}% (healthy is <30%).`,
      action: totalDebt > 0
        ? `Consider paying down $${Math.min(totalDebt, Math.round(excess * 0.5)).toLocaleString()} of existing debt to reduce interest costs.`
        : `Consider investing $${Math.round(excess * 0.6).toLocaleString()} in yield-improving equipment or field expansion.`,
      icon: '📈',
      investmentOptions: {
        debtPaydown: totalDebt > 0 ? Math.min(totalDebt, Math.round(excess * 0.5)) : 0,
        equipmentUpgrade: Math.round(excess * 0.3),
        emergencyReserve: Math.round(excess * 0.3)
      }
    });
  } else if (debtToIncomeRatio > 0.3) {
    recommendations.push({
      category: 'financial',
      severity: 'medium',
      title: 'High Debt-to-Income Ratio',
      description: `Your debt payments ($${monthlyDebtPayments.toLocaleString()}/month) represent ${(debtToIncomeRatio * 100).toFixed(1)}% of annual revenue. Healthy ratio is below 30%.`,
      action: `Focus on debt reduction. Consider paying extra $${Math.round(balance * 0.1).toLocaleString()} toward highest-interest loan this month.`,
      icon: '📊'
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
