"use client";

import React, { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Entry = {
  type: string;
  amount: number;
};

export default function UserFinancialForm() {
  const supabase = createClientComponentClient();

  const [name, setName] = useState("");
  const [age, setAge] = useState<number | undefined>(undefined);
  const [income, setIncome] = useState<number | undefined>(undefined);
  const [expense, setExpense] = useState<number | undefined>(undefined);
  const [investments, setInvestments] = useState<Entry[]>([
    { type: "Stocks", amount: 0 },
    { type: "Real Estate", amount: 0 },
    { type: "Crypto", amount: 0 },
  ]);
  const [liabilities, setLiabilities] = useState<Entry[]>([
    { type: "Student Loan", amount: 0 },
    { type: "Credit Card Debt", amount: 0 },
    { type: "Mortgage", amount: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEntryChange = (
    list: Entry[],
    setList: React.Dispatch<React.SetStateAction<Entry[]>>,
    index: number,
    value: number
  ) => {
    const updated = [...list];
    updated[index].amount = value;
    setList(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSuccess(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("user_financial_profile").insert([
      {
        user_id: user?.id,
        name,
        age,
        income,
        expense,
        investments,
        liabilities,
      },
    ]);

    if (!error) {
      setSuccess(true);
    } else {
      console.error("Error saving data:", error);
    }

    setLoading(false);
  };

  return (
    <Card className="max-w-xl mx-auto p-4">
      <CardContent className="space-y-4">
        <h2 className="text-xl font-semibold mb-2">📊 Your Financial Profile</h2>

        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <Label>Age</Label>
          <Input type="number" value={age ?? ""} onChange={(e) => setAge(Number(e.target.value))} />
        </div>

        <div>
          <Label>Annual Income (₹)</Label>
          <Input type="number" value={income ?? ""} onChange={(e) => setIncome(Number(e.target.value))} />
        </div>

        <div>
          <Label>Average Monthly Expense (₹)</Label>
          <Input type="number" value={expense ?? ""} onChange={(e) => setExpense(Number(e.target.value))} />
        </div>

        <div className="space-y-2">
          <Label>💼 Investments (₹)</Label>
          {investments.map((inv, index) => (
            <div key={inv.type} className="flex items-center gap-2">
              <span className="w-40">{inv.type}:</span>
              <Input
                type="number"
                value={inv.amount}
                onChange={(e) =>
                  handleEntryChange(investments, setInvestments, index, parseFloat(e.target.value))
                }
              />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label>💳 Liabilities (₹)</Label>
          {liabilities.map((item, index) => (
            <div key={item.type} className="flex items-center gap-2">
              <span className="w-40">{item.type}:</span>
              <Input
                type="number"
                value={item.amount}
                onChange={(e) =>
                  handleEntryChange(liabilities, setLiabilities, index, parseFloat(e.target.value))
                }
              />
            </div>
          ))}
        </div>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Submit"}
        </Button>

        {success && <p className="text-green-600">✅ Data saved successfully!</p>}
      </CardContent>
    </Card>
  );
}
