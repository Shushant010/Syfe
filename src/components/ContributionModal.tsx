import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Goal } from '../types';

interface ContributionModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onAddContribution: (goalId: string, amount: number, date: string) => void;
}

const ContributionModal: React.FC<ContributionModalProps> = ({
  goal,
  isOpen,
  onClose,
  onAddContribution,
}) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form fields and errors whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!goal) {
      newErrors.amount = 'No goal selected';
      setErrors(newErrors);
      return false;
    }

    const contributionAmount = parseFloat(amount);
    const remaining = goal.targetAmount - goal.savedAmount;
    if (!amount) {
      newErrors.amount = 'Amount is required';
    }
    else if(remaining==0){
      newErrors.amount = 'Goal already reached, no more contributions allowed';
    } else if (isNaN(contributionAmount)) {
      newErrors.amount = 'Please enter a valid number';
    } else if (contributionAmount < 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (contributionAmount > 1000000) {
      newErrors.amount = 'Amount is too large (max: 1,000,000)';
    } else if (amount.includes('.') && amount.split('.')[1].length > 2) {
      newErrors.amount = 'Amount can have at most 2 decimal places';
    } else if (contributionAmount > remaining) {
      const symbol = goal.currency === 'INR' ? '₹' : '$';
      newErrors.amount = `Amount cannot exceed remaining ${symbol}${remaining.toLocaleString()}`;
    }

    if (!date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal && validateForm()) {
      onAddContribution(goal.id, parseFloat(amount), date);
      onClose();
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  if (!isOpen || !goal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add Contribution</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Contributing to:</p>
          <p className="font-semibold text-gray-800">{goal.name}</p>
          <p className="text-sm text-gray-500">
            Target: {goal.currency === 'INR' ? '₹' : '$'}{goal.targetAmount.toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount ({goal.currency}) *
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-medium"
            >
              Add Contribution
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributionModal;
