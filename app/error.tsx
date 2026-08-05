"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-head">
      <div className="page-head-rail">Failed to send</div>
      <div>
        <h1>That did not go through.</h1>
        <p>Try again. If it keeps failing, the thread is still readable from the start.</p>
        <button type="button" onClick={reset} className="action" style={{ marginTop: "2rem" }}>
          Try again
        </button>
      </div>
    </div>
  );
}
