"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [url, setUrl] = useState("");

  async function createPaste() {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: views ? Number(views) : undefined,
      }),
    });

    const data = await res.json();
    setUrl(data.url);
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Pastebin Lite</h1>

      <textarea
        rows="6"
        style={{ width: "100%" }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <br /><br />

      TTL (seconds):
      <input value={ttl} onChange={(e) => setTtl(e.target.value)} />

      <br />

      Max Views:
      <input value={views} onChange={(e) => setViews(e.target.value)} />

      <br /><br />

      <button onClick={createPaste}>Create Paste</button>

      {url && (
        <p>
          Link: <a href={url}>{url}</a>
        </p>
      )}
    </div>
  );
}
