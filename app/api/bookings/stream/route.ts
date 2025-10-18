import { readBookings } from "../../../lib/store";
export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      async function send() {
        const data = await readBookings();
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }
      await send();
      const iv = setInterval(send, 2000);
      // @ts-ignore
      controller._iv = iv;
    },
    cancel() { /* @ts-ignore */ clearInterval((this as any)._iv); }
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "Connection": "keep-alive" } });
}