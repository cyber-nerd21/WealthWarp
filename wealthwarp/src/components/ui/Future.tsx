"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ScenarioData {
  year: number;
  original: number;
  scenario: number;
}

export default function FutureScenario() {
  const [incomeChange, setIncomeChange] = useState(0);
  const [investmentChange, setInvestmentChange] = useState(0);
  const [bigPurchase, setBigPurchase] = useState(0);
  const [data, setData] = useState<ScenarioData[]>([]);

  const calculateScenario = () => {
    const years = 10;
    const baseIncome = 50000;
    const baseInvestment = 10000;
    const baseGrowthRate = 0.05;
    const baseSpending = 30000;

    const result: ScenarioData[] = [];

    let originalBalance = baseIncome + baseInvestment - baseSpending;
    let scenarioBalance = baseIncome + incomeChange + baseInvestment + investmentChange - baseSpending - bigPurchase;

    for (let i = 1; i <= years; i++) {
      originalBalance *= (1 + baseGrowthRate);
      scenarioBalance *= (1 + baseGrowthRate);

      result.push({
        year: i,
        original: parseFloat(originalBalance.toFixed(2)),
        scenario: parseFloat(scenarioBalance.toFixed(2))
      });
    }

    setData(result);
  };

  return (
    <Card className="p-4">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">What If Scenario Planner</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            type="number"
            placeholder="Change in Job Income"
            onChange={(e) => setIncomeChange(parseFloat(e.target.value) || 0)}
          />
          <Input
            type="number"
            placeholder="Change in Investment"
            onChange={(e) => setInvestmentChange(parseFloat(e.target.value) || 0)}
          />
          <Input
            type="number"
            placeholder="Big Purchase (e.g. house, car)"
            onChange={(e) => setBigPurchase(parseFloat(e.target.value) || 0)}
          />
        </div>

        <Button onClick={calculateScenario}>Simulate</Button>

        {data.length > 0 && (
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: "Year", position: "insideBottomRight", offset: -5 }} />
                <YAxis label={{ value: "Net Worth ($)", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="original" stroke="#8884d8" name="Original" />
                <Line type="monotone" dataKey="scenario" stroke="#82ca9d" name="Scenario" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
