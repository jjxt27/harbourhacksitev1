"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="shell">
      <div className="page-head">
        <p className="page-head-rail">Failed to send</p>
        <h1>That did not go through.</h1>
        <p>Try again. If it keeps failing, the conversation still opens from the start.</p>
        <button type="button" onClick={reset} className="action" style={{ marginTop: "2rem" }}>
          Try again
        </button>
      </div>
    </div>
  );
}
