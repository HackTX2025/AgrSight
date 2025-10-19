'use client';

import {useState, useEffect} from 'react';
import TopBar from '@/components/dashboard/top-bar';
import {api} from '@/lib/api';
import Image from 'next/image';

export default function FinancePage() {
    const [cashflow, setCashflow] = useState<any>(null);
    const [budget, setBudget] = useState<any>(null);
    const [lending, setLending] = useState<any>(null);
    const [loanSim, setLoanSim] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Loan simulator inputs
    const [loanAmount, setLoanAmount] = useState(10000);
    const [loanTerm, setLoanTerm] = useState(36);
    const [loanRate, setLoanRate] = useState(6.5);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cashflowData, budgetData, lendingData] = await Promise.all([
                    api.getCashFlow(),
                    api.getBudget(),
                    api.getLendingReadiness(undefined, 50000)
                ]);

                setCashflow(cashflowData);
                setBudget(budgetData);
                setLending(lendingData);

                // Initial loan simulation
                const simData = await api.simulateLoan(loanAmount, loanTerm, loanRate);
                setLoanSim(simData);
            } catch (error) {
                console.error('Failed to fetch finance data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLoanSimulation = async () => {
        const simData = await api.simulateLoan(loanAmount, loanTerm, loanRate);
        setLoanSim(simData);
    };

    if (loading) {
        return (
            <div className="min-h-screen relative">
                <div className="fixed inset-0 z-0">
                    <Image
                        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/skybg-1760864083256.avif"
                        alt="" fill className="object-cover" priority/>
                </div>
                <div className="fixed inset-0 bg-white/40 z-[1]"/>
                <div className="relative z-10">
                    <TopBar/>
                    <main className="container mx-auto px-4 py-8">
                        <div className="animate-pulse space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-64 bg-gray-300 rounded-xl"></div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    const runwayColor = cashflow?.runway_days < 60 ? 'text-red-600' : cashflow?.runway_days < 120 ? 'text-yellow-600' : 'text-green-600';
    const dscrColor = lending?.dscr_status === 'excellent' ? 'text-green-600' : lending?.dscr_status === 'good' ? 'text-blue-600' : 'text-orange-600';

    return (
        <div className="min-h-screen relative">
            <div className="fixed inset-0 z-0">
                <Image
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/skybg-1760864083256.avif"
                    alt="" fill className="object-cover" priority/>
            </div>
            <div className="fixed inset-0 bg-white/40 z-[1]"/>

            <div className="relative z-10">
                <TopBar/>

                <main className="container mx-auto px-4 py-8">
                    {/* Capital One Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">💰 Capital One Financial Cockpit</h1>
                                <p className="text-blue-100">Complete financial overview with cash flow, budgets, and
                                    lending readiness</p>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-100 text-sm">Lending Score</p>
                                <p className="text-5xl font-bold text-white">{lending?.lending_score}/100</p>
                            </div>
                        </div>
                    </div>

                    {/* Cash Flow Cockpit */}
                    <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20 mb-6">
                        <h2 className="text-2xl font-bold text-[#1a4d4d] mb-4">📊 Cash Flow & Runway</h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div
                                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-500">
                                <p className="text-sm text-green-700 mb-1">Current Balance</p>
                                <p className="text-3xl font-bold text-green-800">${cashflow?.current_balance?.toLocaleString()}</p>
                            </div>

                            <div
                                className={`bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 ${cashflow?.runway_days < 60 ? 'border-red-500' : cashflow?.runway_days < 120 ? 'border-yellow-500' : 'border-green-500'}`}>
                                <p className="text-sm text-gray-700 mb-1">Cash Runway</p>
                                <p className={`text-3xl font-bold ${runwayColor}`}>{cashflow?.runway_days} days</p>
                            </div>

                            <div
                                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-500">
                                <p className="text-sm text-purple-700 mb-1">Daily Net Flow</p>
                                <p className="text-2xl font-bold text-purple-800">${cashflow?.net_daily_flow?.toFixed(2)}</p>
                            </div>

                            <div
                                className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-500">
                                <p className="text-sm text-orange-700 mb-1">Avg Daily Expense</p>
                                <p className="text-2xl font-bold text-orange-800">${cashflow?.avg_daily_expense?.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* 30/60/90 Projections */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {cashflow?.projections?.map((proj: any, idx: number) => (
                                <div key={idx} className="bg-white/60 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-2">{proj.days}-Day Projection</p>
                                    <p className="text-2xl font-bold text-[#1a4d4d]">${proj.balance?.toLocaleString()}</p>
                                    <p className={`text-sm ${proj.flow > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {proj.flow > 0 ? '+' : ''}{proj.flow?.toFixed(2)} net flow
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Budget Tracker */}
                    <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20 mb-6">
                        <h2 className="text-2xl font-bold text-[#1a4d4d] mb-4">💳 Monthly Budget Tracker</h2>

                        <div
                            className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4 border-2 border-indigo-500">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-indigo-700">Total Budget</p>
                                    <p className="text-3xl font-bold text-indigo-900">${budget?.summary?.total_budget?.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-indigo-700">Spent</p>
                                    <p className="text-3xl font-bold text-indigo-900">${budget?.summary?.total_spent?.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-indigo-700">Remaining</p>
                                    <p className="text-3xl font-bold text-green-700">${budget?.summary?.remaining?.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {budget?.categories?.map((cat: any, idx: number) => (
                                <div key={idx} className="bg-white/60 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold text-[#1a4d4d]">{cat.name}</p>
                                            <p className="text-xs text-gray-600">{cat.transactions} transactions</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            cat.status === 'over' ? 'bg-red-100 text-red-800' :
                                                cat.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                        }`}>
                      {cat.percentUsed}%
                    </span>
                                    </div>

                                    <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                                        <div
                                            className={`h-full ${cat.status === 'over' ? 'bg-red-500' : cat.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`}
                                            style={{width: `${Math.min(100, cat.percentUsed)}%`}}
                                        />
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span
                                            className="text-gray-700">${cat.spent?.toLocaleString()} / ${cat.monthlyCap?.toLocaleString()}</span>
                                        <span className="text-gray-600">${cat.remaining?.toLocaleString()} left</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Lending Readiness & Loan Simulator */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                        {/* Lending Readiness */}
                        <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
                            <h2 className="text-2xl font-bold text-[#1a4d4d] mb-4">🏦 Lending Readiness</h2>

                            <div className="space-y-4 mb-6">
                                <div className="bg-white/60 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <span
                                            className="text-sm text-gray-700">Debt Service Coverage Ratio (DSCR)</span>
                                        <span className={`text-2xl font-bold ${dscrColor}`}>{lending?.dscr}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">Target: 1.25+
                                        (You: {lending?.dscr_status})</p>
                                </div>

                                <div className="bg-white/60 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700">Cash Coverage</span>
                                        <span
                                            className="text-2xl font-bold text-[#1a4d4d]">{lending?.cash_coverage_months} months</span>
                                    </div>
                                </div>

                                <div className="bg-white/60 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700">Reserve Target</span>
                                        <span
                                            className="text-lg font-bold text-[#1a4d4d]">${lending?.reserve_target?.toLocaleString()}</span>
                                    </div>
                                    {lending?.reserve_gap > 0 && (
                                        <p className="text-xs text-red-600 mt-1">Gap:
                                            ${lending.reserve_gap.toLocaleString()}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-bold text-[#1a4d4d]">📝 Recommendations</h3>
                                {lending?.recommendations?.map((rec: any, idx: number) => (
                                    <div key={idx} className={`rounded-lg p-3 ${
                                        rec.priority === 'high' ? 'bg-red-50 border-l-4 border-red-500' :
                                            rec.priority === 'medium' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
                                                'bg-green-50 border-l-4 border-green-500'
                                    }`}>
                                        <p className="font-semibold text-sm">{rec.title}</p>
                                        <p className="text-xs text-gray-700 mt-1">{rec.description}</p>
                                        <p className="text-xs text-blue-600 mt-2">→ {rec.action}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Loan Simulator */}
                        <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
                            <h2 className="text-2xl font-bold text-[#1a4d4d] mb-4">🔢 Loan Simulator</h2>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="text-sm text-gray-700 font-medium">Loan Amount:
                                        ${loanAmount.toLocaleString()}</label>
                                    <input
                                        type="range"
                                        min="1000"
                                        max="100000"
                                        step="1000"
                                        value={loanAmount}
                                        onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                                        className="w-full mt-2"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-700 font-medium">Term: {loanTerm} months</label>
                                    <input
                                        type="range"
                                        min="12"
                                        max="120"
                                        step="12"
                                        value={loanTerm}
                                        onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                                        className="w-full mt-2"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-700 font-medium">Rate: {loanRate}%</label>
                                    <input
                                        type="range"
                                        min="3"
                                        max="12"
                                        step="0.5"
                                        value={loanRate}
                                        onChange={(e) => setLoanRate(parseFloat(e.target.value))}
                                        className="w-full mt-2"
                                    />
                                </div>

                                <button
                                    onClick={handleLoanSimulation}
                                    className="w-full bg-[#1a4d4d] hover:bg-[#2a5d5d] text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                                >
                                    Calculate Payment
                                </button>
                            </div>

                            {loanSim && (
                                <div className="space-y-3">
                                    <div
                                        className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-4 text-white">
                                        <p className="text-sm mb-1">Monthly Payment</p>
                                        <p className="text-4xl font-bold">${loanSim.monthly_payment?.toLocaleString()}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white/60 rounded-lg p-3">
                                            <p className="text-xs text-gray-600">Total Payment</p>
                                            <p className="text-lg font-bold text-[#1a4d4d]">${loanSim.total_payment?.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-white/60 rounded-lg p-3">
                                            <p className="text-xs text-gray-600">Total Interest</p>
                                            <p className="text-lg font-bold text-[#1a4d4d]">${loanSim.total_interest?.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                                        <p className="text-xs text-yellow-800">
                                            Impact on monthly cash
                                            flow: <strong>${Math.abs(loanSim.impact_on_monthly_cashflow)?.toFixed(2)}</strong>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-5 ">
                        <a
                            href="https://www.capitalone.com/learn-grow/money-management/how-to-apply-for-a-loan/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button
                                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all">
                                Apply for Capital One Loan
                            </button>
                        </a>
                        <a></a>
                        <a></a>
                        <a></a>
                        <a
                            href="https://www.capitalone.com/learn-grow/business-resources/opening-business-bank-accounts/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <button
                                className="bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all">
                                Open Capital One Business Account
                            </button>
                        </a>
                    </div>
                </main>
            </div>
        </div>
    );
}
