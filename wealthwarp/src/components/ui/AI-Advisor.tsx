"use client";

import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type SpendingRow = {
  category: string;
  amount: number;
};

export default function AIAdvisor() {
  const supabase = createClientComponentClient();
  const [goal, setGoal] = useState("");
  const [spendingData, setSpendingData] = useState<SpendingRow[]>([]);
  const [advice, setAdvice] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSpending = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("spending")
      .select("category, amount")
      .eq("user_id", user?.id);

    if (!error) {
      setSpendingData(data || []);
    } else {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSpending();
  }, []);

  const handleSubmit = async () => {
    if (!goal || spendingData.length === 0) return;
  
    setLoading(true);
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, spendingData }),
      });
  
      const json = await res.json();
  
      if (json?.insights) {
        // Handle both string and array formats
        const lines = typeof json.insights === "string" 
          ? json.insights.split("\n").filter(Boolean)
          : json.insights;
        setAdvice(lines);
      } else {
        setAdvice(["No actionable insights could be generated based on your data."]);
      }
    } catch (err) {
      console.error("Failed to fetch advice:", err);
      setAdvice(["There was a problem getting advice. Try again later."]);
    }
    setLoading(false);
  };
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="text-xl font-semibold">Your Financial Goal</h2>
          <Input
            placeholder="e.g. Save ₹10,000 in 3 months"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <Button onClick={handleSubmit}>Get Advice</Button>
        </CardContent>
      </Card>

      {loading ? (
        <Skeleton className="h-32 w-full" />
      ) : advice.length > 0 ? (
        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-lg font-semibold mb-2">AI Suggestions</h2>
            <ul className="list-disc list-inside space-y-1">
              {advice.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {spendingData.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Current Spending</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
