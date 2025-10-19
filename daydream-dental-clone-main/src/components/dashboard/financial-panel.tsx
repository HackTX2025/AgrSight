'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Transaction {
  id?: string;
  date: string;
  description: string;
  amount: number;
  status?: string;
}

interface FinancialData {
  success: boolean;
  fallback?: boolean;
  account: {
    id: string;
    type: string;
    nickname: string;
    balance: number;
  };
  transactions: Transaction[];
}

export default function FinancialPanel() {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const response = await api.getFinancial();
        setFinancialData(response);
      } catch (error) {
        console.error('Failed to fetch financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  if (loading || !financialData) {
    return (
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/2"></div>
          <div className="h-16 bg-gray-300 rounded"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { account, transactions, fallback } = financialData;

  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[#1a4d4d]">Capital One Account</h2>
        {fallback && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Demo Data</span>
        )}
      </div>

      {/* Account Balance */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 mb-6 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-blue-100 text-sm font-medium">{account.nickname}</p>
            <p className="text-blue-200 text-xs">{account.type} Account</p>
          </div>
          <div className="bg-white/20 rounded-full p-3">
            <span className="text-2xl">💳</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-white text-xs mb-1">Available Balance</p>
          <p className="text-white text-4xl font-bold">${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="text-lg font-bold text-[#1a4d4d] mb-3">Recent Transactions</h3>
        <div className="space-y-2">
          {transactions.map((transaction, idx) => (
            <div
              key={transaction.id || idx}
              className="bg-white/40 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between hover:bg-white/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <span className="text-lg">{transaction.amount > 0 ? '📈' : '💳'}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a4d4d]">{transaction.description}</p>
                  <p className="text-xs text-gray-600">{new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-base font-bold ${
                  transaction.amount > 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button className="bg-[#1a4d4d] hover:bg-[#2a5d5d] text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
          💰 Apply for Loan
        </button>
        <button className="bg-white/60 hover:bg-white/80 text-[#1a4d4d] font-semibold py-2 px-4 rounded-lg transition-colors text-sm border border-[#1a4d4d]/20">
          📊 View Statements
        </button>
      </div>
    </div>
  );
}
