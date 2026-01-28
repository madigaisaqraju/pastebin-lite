import { kv } from "@vercel/kv";

export default async function PastePage({ params }) {
  const paste = await kv.get(`paste:${params.id}`);

  if (!paste) {
    return <h1>404 – Paste not found</h1>;
  }

  const now = Date();

  if (
    (paste.expires_at && now > paste.expires_at) ||
    (paste.max_views !== null && paste.views >= paste.max_views)
  ) {
    return <h1>404 – Paste expired</h1>;
  }

  paste.views += 1;
  await kv.set(`paste:${params.id}`, paste);

  return (
    <pre style={{ whiteSpace: "pre-wrap", padding: "20px" }}>
      {paste.content}
    </pre>
  );
}
