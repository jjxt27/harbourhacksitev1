"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { heroFacts, hero, journey } from "@/content/site";
import { HarbourChart } from "./HarbourChart";

/**
 * The homepage experience: a sticky chart the reader scrubs by scrolling,
 * with the hero and the three journey stages laid over it.
 *
 * Scroll progress is held in a ref rather than state — the chart reads it in
 * its own animation frame, so a scroll never re-renders this tree. Only the
 * active stage, which changes three times over the whole section, is state.
 */
export function Crossing() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<Array<HTMLElement | null>>([]);
  const progressRef = useRef(0);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      progressRef.current = Math.max(0, Math.min(1, -rect.top / distance));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.stageIndex);
          if (Number.isFinite(index)) setActiveStage(index);
        }
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );
    for (const stage of stageRefs.current) if (stage) observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="crossing">
      <div
        className="crossing-chart-shell"
        role="img"
        aria-label="A nautical chart plotting a route from the harbour out to the open market, with a vessel that advances as you scroll"
      >
        <HarbourChart progressRef={progressRef} activeStage={activeStage} />
      </div>

      <section className="crossing-hero" aria-labelledby="crossing-title">
        <h1 id="crossing-title" className="crossing-title" aria-label={hero.headline}>
          <span className="crossing-title-back">Ship</span>
          <span className="crossing-title-front">out<span className="crossing-period">.</span></span>
        </h1>

        <div className="crossing-hero-copy">
          <p>
            {hero.subline.lead}<br />
            {hero.subline.rest} <em>{hero.subline.emphasis}</em>
          </p>
        </div>

        <div className="crossing-hero-action">
          <Link href={hero.primaryCta.href} className="crossing-primary-action">
            {hero.primaryCta.label} <ArrowUpRight aria-hidden="true" />
          </Link>
          <dl className="crossing-facts">
            {heroFacts.map((fact) => (
              <div key={fact.key}>
                <dt>{fact.key}</dt>
                <dd>
                  {fact.date?.iso ? <time dateTime={fact.date.iso}>{fact.value}</time> : fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <a href="#how-it-works" className="crossing-scroll-cue">
          {hero.scrollCue} <ArrowDown aria-hidden="true" />
        </a>
      </section>

      <section id="how-it-works" className="crossing-journey" aria-labelledby="journey-title">
        <h2 id="journey-title" className="crossing-journey-title">
          {journey.title.map((word, index) => (
            <Fragment key={word}>
              {index > 0 ? <span> → </span> : null}
              {word}
            </Fragment>
          ))}
          <span className="crossing-period">.</span>
        </h2>

        <div className="crossing-progress" aria-hidden="true">
          <span>Scroll</span>
          <i />
          {journey.stages.map((stage, index) => (
            <b key={stage.id} className={activeStage === index ? "is-active" : ""}>0{index + 1}</b>
          ))}
        </div>

        {journey.stages.map((stage, index) => (
          <article
            key={stage.id}
            ref={(node) => { stageRefs.current[index] = node; }}
            data-stage-index={index}
            className={`crossing-step ${activeStage === index ? "is-active" : ""}`}
          >
            <div className="crossing-step-copy">
              <p>0{index + 1}</p>
              <h3>{stage.title}</h3>
              <strong>{stage.body}</strong>
              <span>{stage.note}</span>
            </div>
          </article>
        ))}

        <p className="crossing-closing">{journey.closingLine}</p>
      </section>
    </div>
  );
}
