import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { docType, prompt } = await req.json();

  const system = `You output only valid LaTeX. No markdown fences. No explanations. Keep the document self-contained.`;

  const user = `
Document type: ${docType}
Generate a professional ${docType}.
User text:
${prompt}
`.trim();

  // Step 1 — Get LaTeX from Grok
  const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-4-fast-reasoning",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      temperature: 0.2,
      max_tokens: 3000
    })
  });

  const grokJson = await grokRes.json();
  const latex = grokJson?.choices?.[0]?.message?.content ?? "";

  // Step 2 — Compile LaTeX to PDF remotely
  const compileRes = await fetch("https://latexonline.cc/compile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: latex,
      compiler: "pdflatex"
    })
  });

  const pdfBuffer = await compileRes.arrayBuffer();
  const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");

  return NextResponse.json({
    latex,
    pdf: pdfBase64
  });
}
