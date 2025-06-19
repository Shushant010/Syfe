
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { DashboardStats, ExchangeRate } from '../types/index';
import { formatCurrency, convertCurrency } from '../utils/currency';

interface DashboardHeaderProps {
  stats: DashboardStats;
  exchangeRate: ExchangeRate | null;
  onRefreshRate: () => void;
  loading: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  stats,
  exchangeRate,
  onRefreshRate,
  loading
}) => {
  const convertedTargetUSD = exchangeRate ? 
    convertCurrency(stats.totalTarget, 'INR', 'USD', exchangeRate.rate) : 
    0;
  
  const convertedSavedUSD = exchangeRate ? 
    convertCurrency(stats.totalSaved, 'INR', 'USD', exchangeRate.rate) : 
    0;

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Syfe Savings Planner</h1>
          <p className="text-purple-100">Track your financial goals and build your future</p>
        </div>
        <button
          onClick={onRefreshRate}
          disabled={loading}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Rates
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-purple-200 text-sm mb-1">Total Targets</h3>
          <p className="text-2xl font-bold">{formatCurrency(stats.totalTarget, 'INR')}</p>
          {exchangeRate && (
            <p className="text-purple-200 text-sm">{formatCurrency(convertedTargetUSD, 'USD')}</p>
          )}
        </div>
        <div>
          <h3 className="text-purple-200 text-sm mb-1">Total Saved</h3>
          <p className="text-2xl font-bold">{formatCurrency(stats.totalSaved, 'INR')}</p>
          {exchangeRate && (
            <p className="text-purple-200 text-sm">{formatCurrency(convertedSavedUSD, 'USD')}</p>
          )}
        </div>
        <div>
          <h3 className="text-purple-200 text-sm mb-1">Overall Progress</h3>
          <p className="text-2xl font-bold">{stats.overallProgress.toFixed(1)}%</p>
          <p className="text-purple-200 text-sm">Total goals completion</p>
        </div>
      </div>

      {exchangeRate && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-purple-200 text-sm">
            Exchange Rate: 1 USD = ₹{exchangeRate.rate.toFixed(2)} • Last updated: {exchangeRate.lastUpdated}
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
