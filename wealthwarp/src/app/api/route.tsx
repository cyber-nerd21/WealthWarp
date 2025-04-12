import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { spendingData } = await req.json();

  const prompt = `
You're a financial behavior analyst. Analyze this user's categorized spending patterns and provide 3-5 behavior-based insights. Focus on trends, habits, or risks. Example: "You tend to overspend on weekends."

Data:
${JSON.stringify(spendingData, null, 2)}
`;

  const chat = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  const insights = chat.choices[0].message.content;
  return NextResponse.json({ insights });
}
