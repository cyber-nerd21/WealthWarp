import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in your .env file
});

export async function POST(req: NextRequest) {
  try {
    const { spendingData } = await req.json();

    if (!spendingData || !Array.isArray(spendingData) || spendingData.length === 0) {
      return NextResponse.json({
        insight: "No spending data provided to analyze.",
      });
    }

    const prompt = `
You are a financial advisor AI.

Analyze the following user spending data. For each entry, determine whether the spending decision had a:
- Positive impact
- Negative impact
- No major impact

Explain briefly why for each entry based on financial principles (e.g., investing is usually positive, excessive shopping can be negative).

Spending Data:
${JSON.stringify(spendingData, null, 2)}

Return clear insights for the user.
`;

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const insight = chatResponse.choices[0].message.content;

    return NextResponse.json({ insight });
  } catch (error) {
    console.error("Error generating spending insights:", error);
    return NextResponse.json(
      { error: "Failed to generate insights." },
      { status: 500 }
    );
  }
}
