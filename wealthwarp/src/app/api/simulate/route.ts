import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { actual, simulated } = await req.json();

  const prompt = `
You are an AI financial advisor. Compare the actual spending vs the simulated one.
1. What are the key changes?
2. What financial impact would those changes make?
3. Offer brief strategic suggestions.

Actual Spending:
${actual.map((d: any) => `${d.month} - ${d.category}: ₹${d.amount}`).join("\n")}

Simulated Spending:
${simulated.map((d: any) => `${d.month} - ${d.category}: ₹${d.amount}`).join("\n")}

Return your insights in bullet points.
  `;

  const chat = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return NextResponse.json({ insights: chat.choices[0].message.content });
}
