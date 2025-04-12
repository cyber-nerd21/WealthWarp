import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Validate request format
    if (!req.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const { prompt } = await req.json();
    
    // Validate required input
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing or invalid prompt" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 500 });
    }

    // In the system message, update to:
const systemMessage = `You are a financial simulator. Respond STRICTLY with this JSON format:
{
  "data": [
    {"year": 2023, "netWorth": 15000},
    {"year": 2024, "netWorth": 16500}
  ]
}
Rules:
1. "data" must be an array
2. "year" must be consecutive integers
3. "netWorth" must be numbers
4. Never use markdown formatting
5. Always include at least 5 data points`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }, // Enforce JSON mode
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      return NextResponse.json({ error: "AI service error" }, { status: 500 });
    }

    const json = await response.json();
    const content = json.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "Empty AI response" }, { status: 500 });
    }

    // Validate JSON structure
    try {
      JSON.parse(content);
    } catch (e) {
      console.error("Invalid JSON response:", content);
      return NextResponse.json({ error: "Invalid response format" }, { status: 500 });
    }

    return NextResponse.json({ result: content });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}