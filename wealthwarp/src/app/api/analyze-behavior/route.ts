import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { spendingData } = await req.json();

  const prompt = `
You are an AI financial advisor. Analyze this user's historical spending records and decisions (cut, increased, no-change). 

1. Identify which spending decisions had:
   - Positive financial impact
   - Negative financial impact
   - Neutral/no impact

2. Offer specific suggestions for optimizing spending, such as:
   - Reducing certain categories
   - Reallocating money toward investments or savings
   - Financial health improvements

Spending Data:
${spendingData.map((d: any) => `${d.date} - ${d.category} - ₹${d.amount} - Decision: ${d.decision}`).join("\n")}

Format your output:
## Financial Impact
- Positive: ...
- Negative: ...
- Neutral: ...

## Optimization Suggestions
- ...
  `;

  const chat = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return NextResponse.json({ insights: chat.choices[0].message.content });
}
