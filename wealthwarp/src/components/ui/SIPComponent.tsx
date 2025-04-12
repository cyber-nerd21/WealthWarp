'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const InvestmentCalculator: React.FC = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [annualRate, setAnnualRate] = useState(12);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState<number | null>(null);

  const calculateSIP = () => {
    const r = annualRate / 12 / 100;
    const n = years * 12;
    const amount =
      monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    setResult(Math.round(amount));
  };

  return (
    <Card className="w-full h-full mx-auto p-6 shadow-xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black text-white">
      <CardContent className="space-y-4">
        {/* Removed the title here */}

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-300">Monthly Investment (₹)</label>
            <Input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Annual Return Rate (%)</label>
            <Input
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Investment Duration (Years)</label>
            <Input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>

        <Button onClick={calculateSIP} className="w-full">
          Calculate
        </Button>

        {result !== null && (
          <div className="text-center mt-4 text-green-400 font-semibold text-lg">
            ₹{result.toLocaleString()} after {years} years
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvestmentCalculator;
