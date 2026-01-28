import { kv } from "@vercel/kv";

export async function GET() {
  try {
    // Write test key
    await kv.set("healthz:test", "ok");

    // Read it back
    const value = await kv.get("healthz:test");

    // Verify
    if (value !== "ok") {
      return new Response(JSON.stringify({ ok: false }), { status: 500 });
    }

    // Everything works
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    console.error("healthz error:", error);
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  }
}
