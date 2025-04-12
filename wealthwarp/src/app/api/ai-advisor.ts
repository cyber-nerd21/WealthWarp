import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { goal, spendingData } = await req.json();

    if (!goal || !spendingData || !Array.isArray(spendingData)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const prompt = `
You're an AI financial advisor. Help the user reach this goal:
"${goal}"

Here's the user's current monthly spending:
${spendingData
  .map((item: any) => `${item.category}: ₹${item.amount.toFixed(2)}`)
  .join("\n")}

Provide a step-by-step strategy with savings suggestions and budget adjustments.
`;

    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const content = chat.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No advice returned from AI." },
        { status: 500 }
      );
    }

    return NextResponse.json({ advice: content });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
