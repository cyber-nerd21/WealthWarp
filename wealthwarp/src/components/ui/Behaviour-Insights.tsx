"use client";

import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

type SpendingRow = {
  date: string;
  category: string;
  amount: number;
};

export default function BehaviorInsights() {
  const supabase = createClientComponentClient();
  const [spendingData, setSpendingData] = useState<SpendingRow[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpendingData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("spending")
        .select("date, category, amount")
        .eq("user_id", user?.id);

      if (error) {
        console.error("Error fetching spending data:", error);
        return;
      }

      setSpendingData(data || []);
    };

    fetchSpendingData();
  }, []);

  useEffect(() => {
    const fetchInsights = async () => {
      if (spendingData.length === 0) return;

      const res = await fetch("/api/analyze-behavior", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spendingData }),
      });

      const data = await res.json();
      const lines = data.insights.split("\n").filter(Boolean);
      setInsights(lines);
      setLoading(false);
    };

    fetchInsights();
  }, [spendingData]);

  // Chart Preparation
  const categoryTotals = spendingData.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);
  const categoryChartData = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
  }));

  const timeChartData = spendingData.reduce((acc, curr) => {
    const found = acc.find((item) => item.date === curr.date);
    if (found) found.amount += curr.amount;
    else acc.push({ date: curr.date, amount: curr.amount });
    return acc;
  }, [] as { date: string; amount: number }[]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Behavior-Based Insights</h2>
          {loading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <ul className="list-disc list-inside space-y-1">
              {insights.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Spending by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Spending Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
