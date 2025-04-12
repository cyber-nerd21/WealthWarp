// app/api/advanced-analysis/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { userId } = await req.json();

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch transaction history with decisions
    const { data: transactions, error } = await supabase
      .from("spending")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw error;

    const analysisPrompt = `
Analyze these financial transactions:
${transactions?.map(t => `
- Date: ${t.date}
  Category: ${t.category}
  Amount: ₹${t.amount}
  Decision: ${t.decision || 'N/A'}
  Impact: ${t.impact || 'N/A'}`).join('\n')}

Generate:
1. Transaction impact analysis (categorize each as positive/negative/neutral with specific reason)
2. 3-5 spending optimization insights
3. 2-3 investment opportunities with estimated returns

Return JSON format:
{
  "transaction_analysis": [{
    "category": "Dining",
    "amount": 2500,
    "date": "2023-03-15",
    "impact": "negative",
    "reason": "Exceeded monthly food budget by 40%"
  }],
  "insights": ["Reduce dining out by 30% could save ₹750/month"],
  "investment_optimizations": [{
    "type": "investment",
    "title": "Index Fund Investment",
    "description": "Invest saved ₹750/month in Nifty 50 index fund",
    "potentialSavings": 120000
  }]
}
    `;

    const analysis = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: analysisPrompt }],
    });

    return NextResponse.json(JSON.parse(analysis.choices[0].message.content));
    
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Financial analysis failed" },
      { status: 500 }
    );
  }
}