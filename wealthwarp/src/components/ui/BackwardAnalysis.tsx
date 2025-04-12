"use client";

import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SpendingRow {
  category: string;
  amount: number;
  date: string;
  decision: string;
}

export default function BackwardAnalysis() {
  const supabase = createClientComponentClient();
  const [spendingData, setSpendingData] = useState<SpendingRow[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpending = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user || !user.id) {
        console.error("User not authenticated", authError);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("spending")
        .select("category, amount, date, decision")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching spending:", error);
        setLoading(false);
        return;
      }

      setSpendingData(data || []);
      fetchInsights(data || []);
    };

    fetchSpending();
  }, []);

  const fetchInsights = async (data: SpendingRow[]) => {
    try {
      const res = await fetch("/api/ai-backward-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spendingData: data }),
      });

      const json = await res.json();

      const content = json.insights || "No insights returned.";
      const lines = content.split("\n").filter((line: string) => line.trim() !== "");
      setInsights(lines);
    } catch (err) {
      console.error("Error fetching AI insights:", err);
      setInsights(["There was a problem analyzing your data. Try again later."]);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">📈 Advanced Spending Analysis</h1>

      {loading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <>
          {/* Chart */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-3">Spending Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={spendingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Amount" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-3">💡 AI Insights</h2>
              <ul className="list-disc list-inside space-y-1">
                {insights.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
