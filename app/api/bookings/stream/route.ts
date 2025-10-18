import { readBookings } from "../../../lib/store";

export async function GET(req: Request) {
  const encoder = new TextEncoder();
  let lastSnapshot = "";

  const stream = new ReadableStream({
    async start(controller) {
      const write = (chunk: string) =>
        controller.enqueue(encoder.encode(chunk));

      write(`retry: 3000\n\n`);

      const pushData = async () => {
        const list = await readBookings();
        const snapshot = JSON.stringify(list);
        if (snapshot !== lastSnapshot) {
          lastSnapshot = snapshot;
          write(`data: ${snapshot}\n\n`);
        }
      };

      await pushData();

      const tick = setInterval(pushData, 2000);
      const ping = setInterval(() => write(`event: ping\ndata: {}\n\n`), 15000);

      const close = () => {
        clearInterval(tick);
        clearInterval(ping);
        try { controller.close(); } catch {}
      };

      // @ts-ignore
      req?.signal?.addEventListener?.("abort", close);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
