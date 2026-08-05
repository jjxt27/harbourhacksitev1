import type { Metadata } from "next";
import Link from "next/link";
import { faq } from "@/content/faq";
import { Bar } from "@/components/Bar";
import { Foot } from "@/components/Foot";
import { Arrow } from "@/components/Arrow";

export const metadata: Metadata = {
  title: faq.title,
  description: faq.lede,
};

export default function FaqPage() {
  return (
    <>
      <Bar action={{ label: "Register interest", href: "/apply" }} />
      <div className="shell">
        <div className="page-head">
          <p className="page-head-rail">Inbound</p>
          <h1>{faq.title}</h1>
          <p>{faq.lede}</p>
        </div>

        {faq.exchanges.map((exchange) => (
          <article key={exchange.q} className="exchange">
            <time className="exchange-rail" dateTime={`2026-10-01T${exchange.time}`}>
              {exchange.time}
            </time>
            <h2 className="exchange-q">{exchange.q}</h2>
            <div className="exchange-a">
              {exchange.unconfirmed ? <p className="exchange-pending">Not confirmed yet</p> : null}
              {exchange.a.map((line) => <p key={line}>{line}</p>)}
            </div>
          </article>
        ))}

        <div className="exchange">
          <div className="exchange-a">
            <p>{faq.closing.text}</p>
          </div>
          <Link href="/apply" className="action" style={{ marginTop: "1.75rem" }}>
            {faq.closing.action}
            <Arrow />
          </Link>
        </div>
      </div>
      <Foot />
    </>
  );
}
