'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Transaction {
  date: string;
  description: string;
  amount: number;
  id?: string;
  status?: string;
}

interface Account {
  id: string;
  type: string;
  nickname: string;
  balance: number;
}

interface FinancialData {
  success: boolean;
  account: Account;
  transactions: Transaction[];
  fallback?: boolean;
}

export default function FinancialSummary() {
  const [financial, setFinancial] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancial = async () => {
      try {
        const response = await api.getFinancial();
        setFinancial(response);
      } catch (error) {
        console.error('Failed to fetch financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancial();
  }, []);

  if (loading || !financial) {
    return (
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="h-12 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const balance = financial.account.balance;
  const savingsGoal = 75000;
  const progress = (balance / savingsGoal) * 100;
  const monthlySpending = financial.transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
      <h2 className="text-xl font-bold text-[#1a4d4d] mb-6">Financial Summary</h2>
      
      {/* Current Balance */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-1">Current Balance</p>
        <p className="text-5xl font-bold text-[#1a4d4d]">
          ${balance.toLocaleString()}
        </p>
      </div>
      
      {/* Savings Goal Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-600">Savings Goal Progress</p>
          <p className="text-sm font-semibold text-[#1a4d4d]">{progress.toFixed(0)}%</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#5fb574] to-[#d4f1a8] h-full rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Goal: ${savingsGoal.toLocaleString()}
        </p>
      </div>
      
      {/* Recent Transactions */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#1a4d4d] mb-3">Recent Transactions</h3>
        <div className="space-y-3">
          {financial.transactions.map((tx, index) => (
            <div key={tx.id || index} className="flex justify-between items-start text-sm pb-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-[#1a4d4d]">{tx.description}</p>
                <p className="text-xs text-gray-500">{tx.date}</p>
              </div>
              <p className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Monthly Spending */}
      <div className="bg-[#f5f5f0] rounded-lg p-4">
        <p className="text-sm text-gray-600">Monthly Spending</p>
        <p className="text-2xl font-bold text-[#1a4d4d]">
          ${monthlySpending.toLocaleString()}
        </p>
      </div>
    </div>
  );
}