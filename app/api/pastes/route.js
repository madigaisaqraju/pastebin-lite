import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";

export async function POST(req) {
  const body = await req.json();

  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string" || content.trim() === "") {
    return Response.json({ error: "Invalid content" }, { status: 400 });
  }

  if (ttl_seconds !== undefined && ttl_seconds < 1) {
    return Response.json({ error: "Invalid ttl_seconds" }, { status: 400 });
  }

  if (max_views !== undefined && max_views < 1) {
    return Response.json({ error: "Invalid max_views" }, { status: 400 });
  }

  const id = nanoid(8);
  const now = Date.now();

  const expires_at = ttl_seconds ? now + ttl_seconds * 1000 : null;

  await kv.set(`paste:${id}`, {
    content,
    created_at: now,
    expires_at,
    max_views: max_views ?? null,
    views: 0,
  });

  return Response.json({
    id,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
  });
}
