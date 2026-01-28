import { kv } from "@vercel/kv";

export async function GET() {
  try {
    
    await kv.set("healthz:test", "ok");

    
    const value = await kv.get("healthz:test");

    
    if (value !== "ok") {
      return new Response(JSON.stringify({ ok: false }), { status: 500 });
    }

    
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    console.error("healthz error:", error);
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  }
}
