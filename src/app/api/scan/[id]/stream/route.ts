import { NextRequest } from "next/server";
import { getScan, getEvents, getEventCount } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const scan = getScan(id);

  if (!scan) {
    return new Response("Scan not found", { status: 404 });
  }

  // If scan is already done, send all events and close
  if (scan.status !== "running") {
    const events = getEvents(id);
    const lines = events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join("");
    return new Response(lines + "data: [DONE]\n\n", {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  }

  // Stream events as they arrive by polling the event log
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let cursor = 0;

      const poll = () => {
        const currentScan = getScan(id);
        const newEvents = getEvents(id, cursor);

        if (newEvents.length > 0) {
          for (const event of newEvents) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
          }
          cursor += newEvents.length;
        }

        // Check if scan is done
        if (!currentScan || currentScan.status !== "running") {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          return;
        }

        // Keep polling
        setTimeout(poll, 300);
      };

      poll();
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
