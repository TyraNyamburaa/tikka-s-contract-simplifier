import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { z } from "zod";
import pdf from "@cedrugs/pdf-parse";

// Validate the AI response after parsing
const ContractAnalysis = z.object({
  overall_risk_level: z.enum([
    "none",
    "minimal",
    "low",
    "medium",
    "high",
    "extreme",
  ]),

  summary: z.string(),

  red_flags: z.array(
    z.object({
      category: z.string(),
      risk_level: z.enum([
        "none",
        "minimal",
        "low",
        "medium",
        "high",
        "extreme",
      ]),
      original_quote: z.string(),
      plain_english_explanation: z.string(),
    })
  ),
});

export async function POST(req: Request) {
  try {
    // Read uploaded PDF
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json(
        { error: "No file uploaded." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const pdfData = await pdf(buffer);

    const extractedText = pdfData.text;

    if (!extractedText || extractedText.length < 50) {
      return Response.json(
        {
          error:
            "Could not extract text. The PDF may be scanned or contain very little text.",
        },
        { status: 400 }
      );
    }

    // Prevent context overflow
    const text = extractedText.slice(0, 60000);

    const { text: response } = await generateText({
      model: groq("openai/gpt-oss-120b"),

      temperature: 0.2,

      prompt: `
You are an experienced consumer protection lawyer.

Analyze ONLY the contract below.

Rules:

- Only identify risks explicitly written in the contract.
- Never invent clauses.
- Every finding MUST include an exact quotation.
- Write explanations in simple English.
- If no red flags exist, return an empty array.

Return ONLY valid JSON.

The JSON must follow EXACTLY this structure:

{
  "overall_risk_level": "none|minimal|low|medium|high|extreme",
  "summary": "Two sentence summary.",
  "red_flags": [
    {
      "category": "...",
      "risk_level": "...",
      "original_quote": "...",
      "plain_english_explanation": "..."
    }
  ]
}

Contract:

${text}
`,
    });

    // Parse JSON
    const parsed = JSON.parse(response);

    // Validate
    const validated = ContractAnalysis.parse(parsed);

    return Response.json(validated);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to analyze the contract.",
      },
      {
        status: 500,
      }
    );
  }
}