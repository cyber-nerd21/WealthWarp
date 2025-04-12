"use client";

import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
 


interface SpendingCategory {
  category: string;
  amount: number;
}

interface ChangeRow {
  category: string;
  current: number;
  previous: number;
  change: number;
  change_percent: number;
}

interface ClusterRow {
  category: string;
  amount: number;
  cluster: number;
}

export default function AnalysisAdvanced() {
  const [currentData, setCurrentData] = useState<SpendingCategory[]>([]);
  const [previousData, setPreviousData] = useState<SpendingCategory[]>([]);
  const [changeTable, setChangeTable] = useState<ChangeRow[]>([]);
  const [clusters, setClusters] = useState<ClusterRow[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchSpendingData = async () => {
      const userId = (await supabase.auth.getUser()).data.user?.id;

      const { data: current, error: error1 } = await supabase
        .from("spending")
        .select("category, amount")
        .eq("user_id", userId)
        .eq("period", "current");

      const { data: previous, error: error2 } = await supabase
        .from("spending")
        .select("category, amount")
        .eq("user_id", userId)
        .eq("period", "previous");

      if (error1 || error2) {
        console.error("Error fetching data", error1 || error2);
        return;
      }

      setCurrentData(current || []);
      setPreviousData(previous || []);
      fetchMLInsights(current || [], previous || []);
    };

    fetchSpendingData();
  }, []);

  const fetchMLInsights = async (current: SpendingCategory[], previous: SpendingCategory[]) => {
    const res = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current, previous })
    });

    const json = await res.json();
    setChangeTable(json.change_table);
    setClusters(json.clusters);
    setInsights(json.insights);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Advanced Spending Analysis</h1>

      {loading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <>
          {/* Change Table */}
          <Card className="mb-6">
            <CardContent>
              <h2 className="text-lg font-semibold mb-3">Spending Comparison</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th>Category</th>
                    <th>Previous</th>
                    <th>Current</th>
                    <th>Change</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {changeTable.map((row, i) => (
                    <tr key={i} className="border-b">
                      <td>{row.category}</td>
                      <td>${row.previous.toFixed(2)}</td>
                      <td>${row.current.toFixed(2)}</td>
                      <td className={row.change > 0 ? "text-red-500" : "text-green-600"}>
                        {row.change >= 0 ? "+" : "-"}${Math.abs(row.change).toFixed(2)}
                      </td>
                      <td>{row.change_percent.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Cluster Chart */}
          <Card className="mb-6">
            <CardContent>
              <h2 className="text-lg font-semibold mb-3">Spending Clusters</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={clusters}>
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
            <CardContent>
              <h2 className="text-lg font-semibold mb-3">Insights</h2>
              <ul className="list-disc list-inside space-y-1">
                {insights.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
