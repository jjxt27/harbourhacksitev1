import type { Metadata } from "next";
import { apply } from "@/content/apply";
import { dates } from "@/content/site";
import { ApplicationForm } from "@/components/ApplicationForm";
import { Container, Label } from "@/components/ui";

export const metadata: Metadata = {
  title: apply.title,
  description: apply.lede,
};

export default function ApplyPage() {
  return (
    <div className="ground-light pb-20 pt-32 sm:pb-28 sm:pt-40">
      <Container>
        <div className="mx-auto max-w-5xl">
          <header className="mb-12 sm:mb-16">
            <Label as="p">
              {apply.deadlineNote} {dates.applicationsClose.label}
            </Label>
            <h1 className="mt-6 font-display text-display-1 font-extrabold uppercase">
              Ship out<span className="text-tide">.</span>
            </h1>
            <p className="mt-7 max-w-[52ch] text-lead text-ink-70">{apply.lede}</p>
            <p className="mt-5 font-mono text-label uppercase text-ink-muted">{apply.estimate}</p>
          </header>
          <ApplicationForm />
        </div>
      </Container>
    </div>
  );
}
