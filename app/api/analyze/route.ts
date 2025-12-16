import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Backend route for analytics (AI) using OpenAI GPT
export async function POST(req: NextRequest) {
  console.log("Analyzing data with OpenAI...");

  const formData = await req.formData();
  const currentFile = formData.get("current");
  const previousFile = formData.get("previous");
  const customInstructions = (formData.get("customInstructions")?.toString() || "").trim();

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
            "You are a Senior User Acquisition (UA) Analyst specializing in Google Ads for mobile apps (Web2App flows, quiz funnels, subscriptions).\n" +
            "You analyze two time periods of Google Ads performance data and produce a clear, evidence-based narrative: what happened, why it happened, and what to do next.\n\n" +
            "Quality bar:\n" +
            "- Write like a smart human UA analyst reporting to a performance marketing lead.\n" +
            "- Be data-driven: reference concrete numbers or % changes whenever possible.\n" +
            "- Be specific: name likely drivers (creative fatigue, audience saturation, mix shift by GEO/device, bidding changes, budget shifts, learning phase, etc.).\n" +
            "- Be action-oriented: recommendations must logically follow from the drivers.\n" +
            "- If the data does not support a claim, say so and state assumptions.\n" +
            "- Return ONLY valid JSON matching the requested schema. No extra text.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "You are given two datasets exported from Google Ads as plain text (CSV/XLS converted to text):\n\n" +
                (customInstructions
                  ? `User-provided context (optional). Use this to interpret the datasets. If it conflicts with the data, call out the conflict and proceed using the data as primary truth:\n${customInstructions}\n\n`
                  : "User-provided context (optional): none\n\n") +
                "Dataset A — Current period:\n" +
                currentText +
                "\n\nDataset B — Previous period:\n" +
                previousText +
                "\n\nYour job is to compare these periods and produce a structured analysis for a UA manager.\n\n" +
                "Context:\n" +
                "This is a single-user internal tool for a Senior UA manager.\n" +
                "The core question: \"What changed overall, why did it change, and what should I do next?\"\n\n" +
                "Instructions:\n" +
                "1. Start with an account-level overview. Determine the overall direction:\n" +
                "   - up (meaningfully improved)\n" +
                "   - down (meaningfully worse)\n" +
                "   - flat (no meaningful change)\n" +
                "   - mixed (some metrics up, others down)\n" +
                "   Then write: a short headline, a short summary (3–6 sentences), and a list of key metric changes.\n\n" +
                "2. Then explain WHY it happened using drivers:\n" +
                "   - Each driver is a mini root-cause statement.\n" +
                "   - Provide evidence (metrics with current vs previous and delta %).\n" +
                "   - Indicate \"where\" it happened (account/campaign/ad group/ad/geo/device) whenever you can infer it from the data.\n" +
                "   - Include a plausible hypothesis for why this happened.\n" +
                "   - Keep drivers limited to the most important ones (usually 3–8). If there are more, merge similar ones.\n\n" +
                "3. Finally, propose recommendations:\n" +
                "   - Recommendations must directly connect to the drivers.\n" +
                "   - Each recommendation must include: a short title, a short rationale (2–5 sentences) grounded in the data, a list of concrete actions, expected impact, priority.\n" +
                "   - Usually 3–8 recommendations. If more, merge or group.\n\n" +
                "Output requirements:\n" +
                "Return STRICT valid JSON ONLY with this schema (all keys must exist):\n\n" +
                '{\n' +
                '  "overview": {\n' +
                '    "headline": "string",\n' +
                '    "summary": "string",\n' +
                '    "direction": "up | down | flat | mixed",\n' +
                '    "key_changes": [\n' +
                '      {\n' +
                '        "metric": "string",\n' +
                '        "current": "string | number",\n' +
                '        "previous": "string | number",\n' +
                '        "delta_abs": "string | number",\n' +
                '        "delta_pct": "string | number",\n' +
                '        "interpretation": "string"\n' +
                "      }\n" +
                "    ]\n" +
                "  },\n" +
                '  "drivers": [\n' +
                "    {\n" +
                '      "title": "string",\n' +
                '      "what_changed": "string",\n' +
                '      "evidence": [\n' +
                "        {\n" +
                '          "metric": "string",\n' +
                '          "current": "string | number",\n' +
                '          "previous": "string | number",\n' +
                '          "delta_pct": "string | number",\n' +
                '          "notes": "string"\n' +
                "        }\n" +
                "      ],\n" +
                '      "where": {\n' +
                '        "level": "account | campaign | ad_group | ad | geo | device",\n' +
                '        "name": "string"\n' +
                "      },\n" +
                '      "why_hypothesis": "string"\n' +
                "    }\n" +
                "  ],\n" +
                '  "recommendations": [\n' +
                "    {\n" +
                '      "title": "string",\n' +
                '      "rationale": "string",\n' +
                '      "actions": ["string"],\n' +
                '      "expected_impact": "string",\n' +
                '      "priority": "high | medium | low"\n' +
                "    }\n" +
                "  ]\n" +
                "}\n\n" +
                "If you cannot compute a value, use \"unknown\" rather than inventing numbers.\n" +
                "Do not output markdown.\n" +
                "Do not output anything outside the JSON.",
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

    // Validate required structure
    if (!parsed.overview || !parsed.drivers || !parsed.recommendations) {
      console.error("Invalid response structure:", parsed);
      return NextResponse.json(
        { error: "Invalid analysis structure returned from AI" },
        { status: 500 },
      );
    }

    // Ensure arrays exist
    if (!Array.isArray(parsed.drivers)) parsed.drivers = [];
    if (!Array.isArray(parsed.recommendations)) parsed.recommendations = [];
    if (!Array.isArray(parsed.overview?.key_changes))
      parsed.overview.key_changes = [];

    // Attach metadata for downstream usage (e.g. history)
    const responseWithMeta = {
      ...parsed,
      meta: {
        customInstructions: customInstructions || undefined,
        currentFileName: currentFile.name,
        previousFileName: previousFile.name,
        createdAt: new Date().toISOString(),
      },
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

