// components/TransactionImpactCard.tsx
"use client";

interface TransactionImpact {
  category: string;
  amount: number;
  date: string;
  impact: 'positive' | 'negative' | 'neutral';
  reason: string;
}

export default function TransactionImpactCard({ transaction }: { transaction: TransactionImpact }) {
  const impactColors = {
    positive: 'bg-green-100 border-green-300',
    negative: 'bg-red-100 border-red-300',
    neutral: 'bg-gray-100 border-gray-300'
  };

  return (
    <div className={`p-4 rounded-lg border ${impactColors[transaction.impact]}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{transaction.category}</h3>
          <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
        </div>
        <span className="text-lg font-semibold">
          ₹{transaction.amount.toLocaleString()}
        </span>
      </div>
      <p className="text-sm text-gray-700">{transaction.reason}</p>
    </div>
  );
}