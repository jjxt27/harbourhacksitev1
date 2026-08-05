import type { Metadata } from "next";
import Link from "next/link";
import { faq } from "@/content/faq";
import { apply } from "@/content/apply";
import { Arrow } from "@/components/Arrow";

export const metadata: Metadata = {
  title: faq.title,
  description: faq.lede,
};

export default function FaqPage() {
  return (
    <>
      <div className="page-head">
        <div className="page-head-rail">Inbound</div>
        <div>
          <h1>{faq.title}</h1>
          <p>{faq.lede}</p>
        </div>
      </div>

      {faq.exchanges.map((exchange) => (
        <article key={exchange.q} className="exchange">
          <div className="exchange-rail">
            <time dateTime={`2026-10-01T${exchange.time}`}>{exchange.time}</time>
          </div>
          <div>
            <h2 className="exchange-q">{exchange.q}</h2>
            <div className="exchange-a">
              {exchange.unconfirmed ? <p className="exchange-pending">Not confirmed yet</p> : null}
              {exchange.a.map((line) => <p key={line}>{line}</p>)}
            </div>
          </div>
        </article>
      ))}

      <div className="exchange">
        <div className="exchange-rail" />
        <div>
          <p className="msg" data-seen="true">{faq.closing.text}</p>
          <Link href="/apply" className="action" style={{ marginTop: "1.75rem" }}>
            {faq.closing.action}
            <Arrow />
          </Link>
          <p className="sr-only">{apply.lede}</p>
        </div>
      </div>
    </>
  );
}
