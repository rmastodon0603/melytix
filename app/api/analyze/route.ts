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
            "You are a senior User Acquisition analyst for mobile apps using Google Ads. Analyze the differences between two datasets from Google Ads campaigns (current period vs previous period). You must detect performance changes, anomalies, and opportunities.",
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
                "\n\nReturn your analysis STRICTLY in JSON format with this structure:\n\n" +
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

