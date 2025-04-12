"use client";

import React, { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const categories = [
  "Groceries",
  "Shopping",
  "Car Loan",
  "Rent",
  "Utilities",
  "Dining Out",
  "Travel",
  "Investments",
  "Entertainment",
  "Medical",
  "Others",
];

export default function MonthlySpendingForm() {
  const supabase = createClientComponentClient();
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setFeedback(null);
  
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    // Step 1: Call OpenAI first to get the analysis
    const res = await fetch("/api/analyze-spending", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        spendingData: [{ category, amount }],
      }),
    });
  
    const data = await res.json();
    console.log("OpenAI API Response:", data);
    const analysis = data.analysis || "No insights available.";
    console.log("Analysis:", analysis);  // <-- Debug: log the analysis
  
    // Step 2: Store spending in Supabase *with the decision*
    const { error } = await supabase.from("spending").insert([
      {
        user_id: user?.id,
        amount,
        category,
        date: new Date().toISOString().split("T")[0],
        decision: analysis, // 👈 added this line
      },
    ]);
  
    if (error) {
      console.error("Error saving spending:", error);
      setFeedback("Error saving your expense.");
      setLoading(false);
      return;
    }
  
    setFeedback(analysis);
    setLoading(false);
  };
  

  return (
    <Card className="max-w-xl mx-auto p-4">
      <CardContent className="space-y-4">
        <h2 className="text-xl font-semibold">📊 Add Monthly Expense</h2>

        <div>
          <Label>Amount (₹)</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            placeholder="Enter amount"
          />
        </div>

        <div>
          <Label>Category</Label>
          <Select onValueChange={(val) => setCategory(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSubmit} disabled={loading || !category || !amount}>
          {loading ? "Analyzing..." : "Submit"}
        </Button>

        {feedback && (
          <div className="mt-4 p-2 bg-gray-100 rounded text-sm text-gray-800">
            💡 Insight: {feedback}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
