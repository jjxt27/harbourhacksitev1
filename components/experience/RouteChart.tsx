"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * The route the whole experience is built on: you at the lower left, the people
 * you are trying to reach at the upper right. Every other element on the plot
 * is positioned by measuring this path, so moving it moves the markers and the
 * head with it.
 */
const ROUTE = "M150 600C300 590 362 502 470 450 600 388 704 330 860 172";

const VIEWBOX = { width: 1000, height: 700 };

/** Where along the route each journey stage sits, as a fraction of its length. */
const STAGE_AT = [0.2, 0.55, 0.9] as const;

/** Half the span, in viewBox units, used to read the head's bearing. */
const TANGENT = 2;

type Point = { x: number; y: number };

type RouteChartProps = {
  /** Scroll progress through the whole experience, 0 to 1. Read, never set. */
  progressRef: RefObject<number>;
  activeStage: number;
};

/**
 * A plot of the route from you to the people you are trying to reach, with a
 * head that tracks scroll progress along it.
 *
 * Position comes from `getPointAtLength` rather than CSS `offset-path`: it
 * works in every browser that ships SVG, stays in viewBox units so it scales
 * with the container, and gives the bearing for free from a second sample.
 *
 * The loop only writes attributes on two nodes and never sets React state, so
 * scrolling does not re-render the tree.
 */
export function RouteChart({ progressRef, activeStage }: RouteChartProps) {
  const routeRef = useRef<SVGPathElement>(null);
  const runRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const [markers, setMarkers] = useState<Point[]>([]);
  const [length, setLength] = useState(0);

  // Measure once the path is in the document, then place the stage markers.
  useEffect(() => {
    const route = routeRef.current;
    if (!route) return;
    const total = route.getTotalLength();
    setLength(total);
    setMarkers(
      STAGE_AT.map((at) => {
        const point = route.getPointAtLength(total * at);
        return { x: point.x, y: point.y };
      }),
    );
  }, []);

  useEffect(() => {
    const route = routeRef.current;
    const run = runRef.current;
    const head = headRef.current;
    if (!route || !run || !head || !length) return;

    let frame = 0;
    let last = -1;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      const progress = Math.max(0, Math.min(1, progressRef.current ?? 0));
      if (Math.abs(progress - last) < 0.0005) return;
      last = progress;

      const travelled = length * progress;
      const point = route.getPointAtLength(travelled);
      // Bearing comes from a pair of samples straddling the head. Sampling only
      // ahead would collapse to a zero-length vector at the end of the route
      // and snap the head flat on the last frame.
      const behind = route.getPointAtLength(Math.max(0, travelled - TANGENT));
      const ahead = route.getPointAtLength(Math.min(length, travelled + TANGENT));
      const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;

      head.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${angle})`);
      run.style.strokeDashoffset = `${length * (1 - progress)}`;
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [length, progressRef]);

  return (
    <svg
      className="chart"
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* Where you start, and how far your own circle actually reaches. */}
      <g className="chart-origin">
        <ellipse className="chart-contour" cx="150" cy="600" rx="120" ry="78" />
        <ellipse className="chart-contour chart-contour-2" cx="150" cy="600" rx="210" ry="132" />
        <ellipse className="chart-contour chart-contour-3" cx="150" cy="600" rx="310" ry="190" />
      </g>

      <line className="chart-axis" x1="0" y1="200" x2="1000" y2="200" />
      <text className="chart-label" x="52" y="666">You</text>
      <text className="chart-label" x="838" y="120" textAnchor="middle">Them</text>

      {/* The people the whole thing is for. */}
      <g className="chart-cluster">
        <circle cx="860" cy="172" r="5" />
        <circle cx="898" cy="146" r="3.5" />
        <circle cx="826" cy="140" r="3" />
        <circle cx="912" cy="192" r="2.5" />
        <circle cx="800" cy="182" r="2.5" />
      </g>

      <path ref={routeRef} className="chart-route" d={ROUTE} />
      <path
        ref={runRef}
        className="chart-route-run"
        d={ROUTE}
        style={length ? { strokeDasharray: length, strokeDashoffset: length } : { opacity: 0 }}
      />

      {markers.map((marker, index) => (
        <g key={index} className={`chart-marker${activeStage === index ? " is-active" : ""}`}>
          <circle cx={marker.x} cy={marker.y} r="15" />
          <text x={marker.x} y={marker.y + 4.5} textAnchor="middle">
            {`0${index + 1}`}
          </text>
        </g>
      ))}

      <g ref={headRef} transform="translate(150 600)">
        <circle className="chart-head-halo" r="17" />
        <path className="chart-head-body" d="M11 0-7 7-3 0-7-7Z" />
      </g>
    </svg>
  );
}
