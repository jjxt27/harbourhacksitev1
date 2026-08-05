import Link from "next/link";
import { Arrow } from "@/components/Arrow";

export default function NotFound() {
  return (
    <div className="page-head">
      <div className="page-head-rail">Undelivered</div>
      <div>
        <h1>This one did not arrive.</h1>
        <p>The thread is still where you left it.</p>
        <Link href="/" className="action" style={{ marginTop: "2rem" }}>
          Back to the thread
          <Arrow />
        </Link>
      </div>
    </div>
  );
}
