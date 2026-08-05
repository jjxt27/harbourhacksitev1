import type { Metadata } from "next";
import { apply } from "@/content/apply";
import { dates } from "@/content/site";
import { ReplyForm } from "@/components/ReplyForm";

export const metadata: Metadata = {
  title: apply.title,
  description: apply.lede,
};

export default function ApplyPage() {
  return (
    <>
      <div className="page-head">
        <div className="page-head-rail">Applications {dates.applicationsClose.label}</div>
        <div>
          <h1>{apply.title}</h1>
          <p>{apply.lede}</p>
        </div>
      </div>
      <ReplyForm />
    </>
  );
}
