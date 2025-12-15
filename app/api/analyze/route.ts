import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Backend route for analytics (AI) using OpenAI GPT
export async function POST(req: NextRequest) {
  console.log("Analyzing data with OpenAI...");

  const formData = await req.formData();
  const currentFile = formData.get("current");
  const previousFile = formData.get("previous");

  if (!(currentFile instanceof File) || !(previousFile instanceof File)) {
    return NextResponse.json(
      { error: "Both currentFile and previousFile are required" },
      { status: 400 },
    );
  }

  const currentText = await currentFile.text();
  const previousText = await previousFile.text();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Missing OPENAI_API_KEY");
    return NextResponse.json(
      { error: "OpenAI API key is not configured" },
      { status: 500 },
    );
  }

  const client = new OpenAI({ apiKey });

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a senior User Acquisition analyst for mobile apps using Google Ads. Analyze the differences between two datasets from Google Ads campaigns (current period vs previous period). You must detect performance changes, anomalies, and opportunities. For every alert, insight and recommendation, write a short analytical paragraph of 2–5 sentences that explains:\n- what changed,\n- which approximate metrics or percentage changes support this,\n- why it matters for the business,\n- and, when possible, 1–2 likely causes or hypotheses.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Analyze the two provided datasets (CSV-like text). Each file represents campaign metrics from Google Ads.\n\n" +
                "Current period data:\n" +
                currentText +
                "\n\nPrevious period data:\n" +
                previousText +
                "\n\nFor the JSON you return, follow these guidelines:\n\n" +
                '- In "alerts": provide analytical paragraphs that explain why this is important, which metrics changed (e.g. CTR, CPC, CPA, conversions, spend) and by roughly how much, and what could be the cause (e.g. creative fatigue, audience saturation, GEO mix, device mix).\n' +
                '- In "insights": describe interesting or positive trends, approximate percentage changes, and what opportunity they represent (e.g. which campaigns, ad groups, creatives or GEOs could be scaled).\n' +
                '- In "recommendations": speak like a senior UA manager. For each item, clearly say what to do, why this action makes sense, and which metrics justify it (with rough percentage changes where possible).\n' +
                "- If some metrics are missing in the data, you may still infer reasonable percentage changes based on spend, clicks, conversions or other visible columns.\n" +
                "- Each `details` field should be a compact but rich paragraph that feels like a mini-analysis, not just a single sentence.\n\n" +
                "Return your analysis STRICTLY in JSON format with this structure:\n\n" +
                '{\n  "alerts": [\n    { "title": "string", "level": "critical|warning|positive", "details": "string" }\n  ],\n  "insights": [\n    { "title": "string", "details": "string" }\n  ],\n  "recommendations": [\n    { "title": "string", "details": "string" }\n  ]\n}\n',
            },
          ],
        },
      ],
      temperature: 0.3,
    });

    const rawContent =
      completion.choices[0]?.message?.content?.toString().trim() ?? "";

    console.log("OpenAI response:", rawContent);

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (parseError) {
      console.error("OpenAI raw response:", rawContent);
      return NextResponse.json(
        { error: "Failed to parse OpenAI response" },
        { status: 500 },
      );
    }

    // Attach raw filenames for downstream usage (e.g. history)
    const responseWithMeta = {
      ...parsed,
      raw: {
        currentFileName: currentFile.name,
        previousFileName: previousFile.name,
      },
    };

    return NextResponse.json(responseWithMeta, { status: 200 });
  } catch (error: any) {
    console.error("OpenAI error:", error?.message ?? error);
    if (error?.response) {
      console.error("OpenAI error response:", error.response);
    }

    return NextResponse.json(
      { error: "OpenAI API error, check server logs for details" },
      { status: 500 },
    );
  }
}

