import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Goal, Contribution, DashboardStats } from '../types/index';
import { useExchangeRate } from '../hooks/useExchangeRate';
import DashboardHeader from '../components/DashboardHeader';
import AddGoalForm from '../components/AddGoalForm';
import GoalCard from '../components/GoalCard';
import ContributionModal from '../components/ContributionModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


const Index = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { exchangeRate, loading, error, refetch } = useExchangeRate();

  // Load goals from localStorage on mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('savings-goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Save goals to localStorage when goals change
  useEffect(() => {
    localStorage.setItem('savings-goals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = (goalData: Omit<Goal, 'id' | 'savedAmount' | 'contributions' | 'createdAt' | 'badges'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: uuidv4(),
      savedAmount: 0,
      contributions: [],
      createdAt: new Date(),
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const addContribution = (goalId: string, amount: number, date: string) => {
    const contribution: Contribution = {
      id: uuidv4(),
      amount,
      date,
      goalId,
    };

    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          savedAmount: goal.savedAmount + amount,
          contributions: [...goal.contributions, contribution],
        };
      }
      return goal;
    }));
  };

  const handleAddContribution = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      setSelectedGoal(goal);
      setIsModalOpen(true);
    }
  };

  // New: delete a goal
  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  };

  const calculateDashboardStats = (): DashboardStats => {
  const rate = exchangeRate?.rate || 1;

  // Sum targets and saved by currency
  const totalTargetINR = goals
    .filter(g => g.currency === 'INR')
    .reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSavedINR = goals
    .filter(g => g.currency === 'INR')
    .reduce((sum, g) => sum + g.savedAmount, 0);

  const totalTargetUSD = goals
    .filter(g => g.currency === 'USD')
    .reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSavedUSD = goals
    .filter(g => g.currency === 'USD')
    .reduce((sum, g) => sum + g.savedAmount, 0);

  // Overall progress — average of each goal’s completion %
  let overallProgress = 0;
  if (goals.length > 0) {
    const totalProgress = goals.reduce((sum, g) => {
      const prog = g.targetAmount > 0 ? (g.savedAmount / g.targetAmount) * 100 : 0;
      return sum + Math.min(prog, 100);
    }, 0);
    overallProgress = totalProgress / goals.length;
  }

  return {
    totalTargetINR,
    totalSavedINR,
    totalTargetUSD,
    totalSavedUSD,
    overallProgress,
  };
};


  const dashboardStats = calculateDashboardStats();


// inside your component, below calculateDashboardStats():
const generateMonthlyStatement = () => {
  // Use points and a standard letter page for consistent layout
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const now = new Date();
  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  // 👉 Use a normal hyphen instead of an em–dash:
doc.text(`Monthly Statement - ${monthName}`, 40, 60);

// 👉 And avoid curly apostrophes in any literal:
// Instead of “this month’s”, write “this month’s” with a straight apostrophe:
// (Though comments don’t end up in the PDF, make sure no smart quotes slip into your template strings!)


  // Timestamp
  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  doc.text(`Generated on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 40, 80);

  // Gather this month’s contributions
  const contributionsThisMonth = goals.flatMap(goal =>
    goal.contributions
      .filter(c => {
        const d = new Date(c.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .map(c => ({
        name: goal.name,
        date: c.date,
        amount: c.amount,
        currency: goal.currency,
      }))
  );
  const totalThisMonth = contributionsThisMonth.reduce((sum, c) => sum + c.amount, 0);

  // Summary block
  doc.text(`Total Saved This Month: Rs.${totalThisMonth.toLocaleString()}`, 40, 100);

  // Build table data
  const tableBody = contributionsThisMonth.map(c => [
    c.name,
    c.date,
    c.currency === 'INR'
      ? `Rs. ${c.amount.toLocaleString()}`
      : `USD ${c.amount.toLocaleString()}`
  ]);

  autoTable(doc, {
    head: [['Goal', 'Date', 'Amount']],
    body: tableBody,
    startY: 120,
    margin: { left: 40, right: 40 },
    styles: {
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [33, 150, 243],
      textColor: 255,
      halign: 'center',
      fontStyle: 'bold',
    },
    bodyStyles: {
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 200 },
      1: { cellWidth: 100 },
      2: { cellWidth: 100 },
    },
  });

  // Footer with page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() - 100,
      doc.internal.pageSize.getHeight() - 30
    );
  }

  // Save as a nicely formatted PDF
  doc.save(`Statement_${monthName.replace(/\s/g, '_')}.pdf`);
};




  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-semibold text-gray-800">Your Goals</h2>
  <div className="flex items-center space-x-4">
    <span className="text-gray-600 text-sm">{goals.length} goals</span>
   <button
  onClick={generateMonthlyStatement}
  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
>
  Download Monthly Statement
</button>
  </div>
</div>

        <DashboardHeader
          stats={dashboardStats}
          exchangeRate={exchangeRate}
          onRefreshRate={refetch}
          loading={loading}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            Error fetching exchange rate: {error}
          </div>
        )}

        <AddGoalForm onAddGoal={addGoal} />

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Goals</h2>
            <span className="text-gray-600 text-sm">{goals.length} goals</span>
          </div>

          {goals.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-lg">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No goals yet</h3>
              <p className="text-gray-600">Create your first savings goal to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  exchangeRate={exchangeRate}
                  onAddContribution={handleAddContribution}
                  onDeleteGoal={handleDeleteGoal}
                />
              ))}
            </div>
          )}
        </div>

        <ContributionModal
          goal={selectedGoal}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedGoal(null);
          }}
          onAddContribution={addContribution}
        />
      </div>
    </div>
  );
};

export default Index;
