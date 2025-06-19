
import React, { useState } from 'react';
import { Goal } from '../types/index';

interface AddGoalFormProps {
  onAddGoal: (goal: Omit<Goal, 'id' | 'savedAmount' | 'contributions' | 'createdAt'>) => void;
}

const AddGoalForm: React.FC<AddGoalFormProps> = ({ onAddGoal }) => {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currency: 'INR' as 'INR' | 'USD'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Goal name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Goal name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Goal name must be less than 50 characters';
    }

    // Amount validation
    const amount = parseFloat(formData.targetAmount);
    if (!formData.targetAmount) {
      newErrors.targetAmount = 'Target amount is required';
    } else if (isNaN(amount)) {
      newErrors.targetAmount = 'Please enter a valid number';
    } else if (amount <= 0) {
      newErrors.targetAmount = 'Amount must be greater than 0';
    } else if (amount > 10000000) {
      newErrors.targetAmount = 'Amount is too large (max: 10,000,000)';
    } else if (formData.targetAmount.includes('.') && formData.targetAmount.split('.')[1].length > 2) {
      newErrors.targetAmount = 'Amount can have at most 2 decimal places';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddGoal({
        name: formData.name.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        currency: formData.currency
      });
      
      setFormData({ name: '', targetAmount: '', currency: 'INR' });
      setErrors({});
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, targetAmount: value });
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Goal</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Goal Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Trip to Japan"
              maxLength={50}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Target Amount *
            </label>
            <input
              type="text"
              id="targetAmount"
              value={formData.targetAmount}
              onChange={handleAmountChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.targetAmount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.targetAmount && <p className="text-red-500 text-sm mt-1">{errors.targetAmount}</p>}
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              Currency *
            </label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value as 'INR' | 'USD' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-medium"
        >
          Add Goal
        </button>
      </form>
    </div>
  );
};

export default AddGoalForm;
