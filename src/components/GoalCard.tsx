import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Goal, ExchangeRate } from '../types';
import { formatCurrency, convertCurrency } from '../utils/currency';
import GoalProgressChart from "./GoalProgressChart";

interface GoalCardProps {
  goal: Goal;
  exchangeRate: ExchangeRate | null;
  onAddContribution: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, exchangeRate, onAddContribution, onDeleteGoal }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const progress = (goal.savedAmount / goal.targetAmount) * 100;
  const convertedTarget = exchangeRate ?
    convertCurrency(goal.targetAmount, goal.currency, goal.currency === 'INR' ? 'USD' : 'INR', exchangeRate.rate) :
    0;
  const remainingAmount = goal.targetAmount - goal.savedAmount;

  // track previous progress to detect crossing 100%
  const prevProgress = useRef(progress);
  useEffect(() => {
    if (prevProgress.current < 100 && progress >= 100) {
      setShowCongrats(true);
    }
    prevProgress.current = progress;
  }, [progress]);

  const openConfirm = () => setShowConfirm(true);
  const cancelDelete = () => setShowConfirm(false);
  const confirmDelete = () => {
    onDeleteGoal(goal.id);
    setShowConfirm(false);
  };

  return (
    <div className="relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      {/* Congratulation Modal */}
      {showCongrats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h3 className="text-2xl font-bold mb-2">🎉 Congratulations!</h3>
            <p className="mb-4">You’ve reached 100% of your savings goal: <strong>{goal.name}</strong>.</p>
            <button
              onClick={() => setShowCongrats(false)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{goal.name}</h3>
          <div className="text-sm text-gray-600 mt-1">
            <p>Target: {formatCurrency(goal.targetAmount, goal.currency)}</p>
            {exchangeRate && (
              <p>({formatCurrency(convertedTarget, goal.currency === 'INR' ? 'USD' : 'INR')})</p>
            )}
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          progress >= 100 ? 'bg-green-100 text-green-800' :
          progress >= 50 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {progress.toFixed(0)}%
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{formatCurrency(goal.savedAmount, goal.currency)} saved</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <p>{goal.contributions.length} contributions</p>
          <p>{formatCurrency(remainingAmount, goal.currency)} remaining</p>
        </div>
        <button
          onClick={() => onAddContribution(goal.id)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Contribution
        </button>
      </div>

      <div className="mt-4">
        <GoalProgressChart
          targetAmount={goal.targetAmount}
          contributions={goal.contributions.map(c => ({ date: c.date, amount: c.amount }))}
          currencySymbol={goal.currency === "INR" ? "₹" : "$"}
        />
      </div>

      {/* Delete Icon in bottom-right */}
      <button
        onClick={openConfirm}
        className="absolute bottom-0 right-3 p-2 rounded-full hover:bg-red-100 transition-colors text-gray-500"
        aria-label="Delete goal"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      {/* Inline Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h4 className="text-lg font-semibold mb-2">Delete Goal?</h4>
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to delete this savings goal?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GoalCard;
