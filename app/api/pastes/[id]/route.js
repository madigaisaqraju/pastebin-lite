import { kv } from "@vercel/kv";

function getNow(req) {
  if (process.env.TEST_MODE === "1") {
    const testNow = req.headers.get("x-test-now-ms");
    if (testNow) return Number(testNow);
  }
  return Date.now();
}

export async function GET(req, { params }) {
  const { id } = params;
  const paste = await kv.get(`paste:${id}`);

  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const now = getNow(req);

  if (paste.expires_at && now > paste.expires_at) {
    return Response.json({ error: "Expired" }, { status: 404 });
  }

  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  paste.views += 1;
  await kv.set(`paste:${id}`, paste);

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.max_views !== null ? paste.max_views - paste.views : null,
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}
