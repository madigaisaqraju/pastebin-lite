import { createClient } from 'redis';
import { NextResponse } from 'next/server';

const redis = createClient({
  url: process.env.REDIS_URL
});


if (!global.redisClient) {
  global.redisClient = redis.connect();
}

export async function GET() {
  try {
    
    await redis.set("healthz:test", "ok");

    
    const value = await redis.get("healthz:test");

    
    if (value !== "ok") {
      return new NextResponse(JSON.stringify({ ok: false }), { status: 500 });
    }

    return new NextResponse(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    console.error("healthz error:", error);
    return new NextResponse(JSON.stringify({ ok: false }), { status: 500 });
  }
}
