import Link from "next/link";
import { Bar } from "@/components/Bar";
import { Foot } from "@/components/Foot";
import { Arrow } from "@/components/Arrow";

export default function NotFound() {
  return (
    <>
      <Bar action={{ label: "Register interest", href: "/apply" }} />
      <div className="shell">
        <div className="page-head">
          <p className="page-head-rail">Undelivered</p>
          <h1>This one did not arrive.</h1>
          <p>The conversation is still where you left it.</p>
          <Link href="/" className="action" style={{ marginTop: "2rem" }}>
            Back to the chat
            <Arrow />
          </Link>
        </div>
      </div>
      <Foot />
    </>
  );
}
