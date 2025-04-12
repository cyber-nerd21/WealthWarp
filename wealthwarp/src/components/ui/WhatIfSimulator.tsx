"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
  } from "recharts";
  
interface DataPoint {
  year: number;
  netWorth: number;
}

export default function WhatIfSimulator() {
  const [scenarioType, setScenarioType] = useState("");
  const [startingNetWorth, setStartingNetWorth] = useState(15000);
  const [investmentAsset, setInvestmentAsset] = useState("");
  const [investmentYearsAgo, setInvestmentYearsAgo] = useState(5);
  const [newCareer, setNewCareer] = useState("");
  const [customScenario, setCustomScenario] = useState("");
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  const buildPrompt = (): string => {
    switch (scenarioType) {
      case "invest":
        return `If I had invested in ${investmentAsset} ${investmentYearsAgo} years ago with a starting net worth of $${startingNetWorth}, how would my net worth have evolved until today? Show yearly changes for each year.`;
      case "career":
        return `If I switch my career to ${newCareer} today with a net worth of $${startingNetWorth}, how will my net worth change over the next 10 years? Give yearly estimates.`;
      case "house":
        return `If I bought a house today worth $300,000 with a $${startingNetWorth} net worth, how would it impact my finances over the next 10 years? Show yearly net worth.`;
      case "debt":
        return `If I used my current net worth of $${startingNetWorth} to pay off my debt, how would that affect my financial future in the next 10 years?`;
      case "relocation":
        return `If I move to a lower cost-of-living city today with a net worth of $${startingNetWorth}, how will my financial situation change over the next 10 years?`;
      case "custom":
        return `Based on this custom scenario: "${customScenario}" and a starting net worth of $${startingNetWorth}, how would my net worth change over the next 10 years? Show JSON output of yearly values.`;
      default:
        return "";
    }
  };

  const simulateScenario = async () => {
    setLoading(true);
    setError("");
    setData([]);
  
    try {
      const res = await fetch("/api/what-if", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildPrompt() }),
      });
  
      if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
  
      const { result } = await res.json();
      const content = result.replace(/```json|```/g, "").trim();
  
      // First parse
      const parsed = JSON.parse(content);
      
      // Check for new structure
      if (!parsed?.data) {
        console.error("Missing data property:", parsed);
        throw new Error("Invalid response structure");
      }
  
      // Validate array structure
      const dataArray = parsed.data;
      if (!Array.isArray(dataArray)) {
        console.error("Data is not array:", dataArray);
        throw new Error("Invalid data format");
      }
  
      // Validate each item
      const isValid = dataArray.every(item => 
        typeof item?.year === 'number' && 
        typeof item?.netWorth === 'number'
      );
      
      if (!isValid) {
        console.error("Invalid items:", dataArray);
        throw new Error("Invalid data types");
      }
  
      setData(dataArray);
  
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(`Simulation failed: ${message}`);
      console.error("Full error:", err);
    } finally {
      setLoading(false);
    }
  };
      
      

    
  console.log("Chart data:", data);
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">💭 What If Simulator</h1>

      <Card className="mb-6">
        <CardContent className="grid gap-4 py-4">
          <div>
            <Label>Starting Net Worth ($)</Label>
            <Input
              type="number"
              value={startingNetWorth}
              onChange={(e) => setStartingNetWorth(parseFloat(e.target.value))}
            />
          </div>

          <div>
            <Label>Select a Scenario</Label>
            <Select onValueChange={(val: string) => setScenarioType(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a what-if scenario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="invest">What if I had invested in an asset?</SelectItem>
                <SelectItem value="career">What if I switched careers?</SelectItem>
                <SelectItem value="house">What if I bought a house?</SelectItem>
                <SelectItem value="debt">What if I paid off my debt?</SelectItem>
                <SelectItem value="relocation">What if I moved to a cheaper city?</SelectItem>
                <SelectItem value="custom">Other (Custom Scenario)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {scenarioType === "invest" && (
            <>
              <div>
                <Label>Which Asset?</Label>
                <Input
                  value={investmentAsset}
                  onChange={(e) => setInvestmentAsset(e.target.value)}
                  placeholder="e.g. Apple stock, Bitcoin, S&P 500"
                />
              </div>
              <div>
                <Label>How many years ago?</Label>
                <Input
                  type="number"
                  value={investmentYearsAgo}
                  onChange={(e) => setInvestmentYearsAgo(parseInt(e.target.value))}
                />
              </div>
            </>
          )}

          {scenarioType === "career" && (
            <div>
              <Label>Career you're switching to</Label>
              <Input
                value={newCareer}
                onChange={(e) => setNewCareer(e.target.value)}
                placeholder="e.g. Freelancer, Data Scientist"
              />
            </div>
          )}

          {scenarioType === "custom" && (
            <div>
              <Label>Describe your custom scenario</Label>
              <Textarea
                value={customScenario}
                onChange={(e) => setCustomScenario(e.target.value)}
                placeholder="e.g. I started a side hustle and saved 20% of my income"
              />
            </div>
          )}

          <Button onClick={simulateScenario} disabled={loading || !scenarioType}>
            {loading ? "Simulating..." : "Simulate"}
          </Button>

          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
      </Card>
      

      {data.length > 0 && (
  <Card className="mt-4">
    <CardContent>
      <h2 className="text-lg font-semibold mb-4">📈 Projected Net Worth</h2>
      <ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis 
      dataKey="year" 
      tickFormatter={(value) => `Yr ${value}`}
    />
    <YAxis 
      tickFormatter={(value) => `$${value.toLocaleString()}`}
    />
    <Tooltip 
      formatter={(value: number) => `$${value.toLocaleString()}`}
      labelFormatter={(label) => `Year ${label}`}
    />
    <Line 
      type="monotone" 
      dataKey="netWorth" 
      stroke="#4f46e5"
      strokeWidth={2}
      dot={{ fill: '#4f46e5' }}
    />
  </LineChart>
</ResponsiveContainer>
    </CardContent>
  </Card>
)}

    </div>
  );
}
