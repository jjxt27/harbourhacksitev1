import type { Metadata } from "next";
import { apply } from "@/content/apply";
import { dates } from "@/content/site";
import { Bar } from "@/components/Bar";
import { Foot } from "@/components/Foot";
import { ReplyForm } from "@/components/ReplyForm";

export const metadata: Metadata = {
  title: apply.title,
  description: apply.lede,
};

export default function ApplyPage() {
  return (
    <>
      <Bar action={{ label: "Back to chat", href: "/" }} />
      <div className="shell">
        <div className="page-head">
          <p className="page-head-rail">Applications {dates.applicationsClose.label}</p>
          <h1>{apply.title}</h1>
          <p>{apply.lede}</p>
        </div>
        <ReplyForm />
      </div>
      <Foot />
    </>
  );
}
