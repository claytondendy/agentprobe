import { NextRequest, NextResponse } from "next/server";
import { ScanConfig } from "@/lib/types";
import { createScan, getAllScans } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const validModes = ["prompt", "redteam", "mcp"];
  const validModules = ["prompt-injection", "data-exfiltration", "jailbreak", "excessive-agency", "sensitive-data"];

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Agent name is required" }, { status: 400 });
  }
  if (body.mode === "prompt" && !body.systemPrompt?.trim()) {
    return NextResponse.json({ error: "System prompt is required for prompt scan mode" }, { status: 400 });
  }
  if (body.mode && !validModes.includes(body.mode)) {
    return NextResponse.json({ error: "Invalid scan mode" }, { status: 400 });
  }

  const modules = (body.modules || validModules).filter((m: string) => validModules.includes(m));
  const id = crypto.randomUUID();

  const config: ScanConfig = {
    id,
    name: body.name || "Untitled Scan",
    mode: body.mode || "prompt",
    systemPrompt: body.systemPrompt,
    apiEndpoint: body.apiEndpoint,
    modules,
    intensity: body.intensity || "medium",
    createdAt: new Date().toISOString(),
  };

  createScan(config);

  // Scan execution happens in the SSE stream route, not here.
  return NextResponse.json({ id, status: "running" });
}

export async function GET() {
  return NextResponse.json(getAllScans());
}
