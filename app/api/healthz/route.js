export const runtime = "nodejs"; 

import { createClient } from "redis";

let redis;

async function getRedis() {
  if (!redis) {
    redis = createClient({
      url: process.env.REDIS_URL,
    });
    await redis.connect();
  }
  return redis;
}

export async function GET() {
  try {
    const client = await getRedis();

    await client.set("healthz:test", "ok");
    const value = await client.get("healthz:test");

    if (value !== "ok") {
      return new Response(JSON.stringify({ ok: false }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    console.error("healthz error:", error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500 }
    );
  }
}