import { NextRequest } from "next/server";
import { getScan, updateScan, completeScan } from "@/lib/store";
import { runScan } from "@/lib/scan-engine";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const scan = getScan(id);

  if (!scan) {
    return new Response("Scan not found", { status: 404 });
  }

  // Don't re-run completed or failed scans
  if (scan.status !== "running") {
    return new Response(`data: ${JSON.stringify({ type: "scan-complete", message: "Scan already finished.", progress: 100 })}\n\ndata: [DONE]\n\n`, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of runScan(scan.config)) {
          if (event.moduleResult) {
            updateScan(id, event.moduleResult);
          }
          const data = JSON.stringify(event);
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
        completeScan(id);
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        const errorMsg = String(err);
        console.error("Scan error:", errorMsg);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message: errorMsg, progress: 0 })}\n\n`));
        // Mark scan as failed so results page doesn't hang
        const failedScan = getScan(id);
        if (failedScan) {
          failedScan.status = "failed";
          failedScan.completedAt = new Date().toISOString();
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
