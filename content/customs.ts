/**
 * Copy and options for the Customs Office — the registration dock.
 *
 * The declaration fields and the cargo containers are both data, not markup:
 * the form, the validator, the barge and the boarding pass all iterate these
 * lists, so adding a container is a one-line change here.
 */

/** Text inputs on the declaration. `required` drives validation and the label. */
export const declarationFields = [
  {
    name: "name",
    label: "Full name",
    placeholder: "Who's boarding?",
    type: "text",
    autoComplete: "name",
    required: true,
    max: 48,
  },
  {
    name: "email",
    label: "Email address",
    placeholder: "you@university.edu.au",
    type: "email",
    autoComplete: "email",
    required: true,
    max: 96,
  },
  {
    name: "university",
    label: "University",
    placeholder: "e.g. UNSW, USYD, UTS",
    type: "text",
    autoComplete: "organization",
    required: true,
    max: 64,
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    placeholder: "linkedin.com/in/… (optional)",
    type: "url",
    autoComplete: "url",
    required: false,
    max: 120,
  },
] as const;

export type FieldName = (typeof declarationFields)[number]["name"];

/**
 * Cargo. Each container carries a class code painted on its side, the way a
 * real one does — `CRG-` plus a discipline letter plus an index.
 */
export const containers = [
  { id: "tech", label: "Tech", code: "CRG-101", class: "build" },
  { id: "design", label: "Design", code: "CRG-102", class: "build" },
  { id: "react", label: "React", code: "CRG-103", class: "build" },
  { id: "data", label: "Data", code: "CRG-104", class: "build" },
  { id: "biz", label: "Biz", code: "CRG-201", class: "market" },
  { id: "marketing", label: "Marketing", code: "CRG-202", class: "market" },
  { id: "sales", label: "Sales", code: "CRG-203", class: "market" },
  { id: "copy", label: "Copywriting", code: "CRG-204", class: "market" },
  { id: "video", label: "Video", code: "CRG-205", class: "market" },
] as const;

export type Container = (typeof containers)[number];
export type ContainerId = Container["id"];

/** What the barge will carry. The pass is laid out to wrap at this many. */
export const MAX_CARGO = 3;

export const customs = {
  kicker: "Dock 03 — Circular Quay Terminal",
  headline: "Clear customs",
  subtext:
    "Declare who you are, load your cargo, and the crane prints your boarding pass.",

  declarationTitle: "Customs declaration",
  declarationNote: "Required unless marked optional.",

  loaderTitle: "The cargo loader",
  loaderHint:
    "Drag a container onto the barge — or focus one and press Enter. Load up to " +
    `${MAX_CARGO}.`,
  bargeLabel: "The barge",
  bargeEmpty: "Hold empty",
  bargeFull: "Hold full — unload one to swap",
  unloadHint: "Press Enter to unload",

  crane: "Lower the crane",
  cranePending: "Clearing customs…",
  cranePrinting: "Printing manifest…",
  craneBlocked: "Complete the declaration and load at least one container",

  errors: {
    name: "We need a name for the manifest.",
    email: "That doesn't look like an email address.",
    university: "Which university are you at?",
    linkedin: "That doesn't look like a URL.",
    cargo: "Load at least one container onto the barge.",
    submit: "Customs didn't respond. Try lowering the crane again.",
    /** The pass rendered; only the automatic save was refused. */
    print: "Your pass is ready — the browser blocked the automatic download. Grab it below.",
    /** Nothing rendered. Usually a hidden tab. Worth simply asking again. */
    printRetry: "The printer stalled before it finished. Run it again.",
  },

  printAgain: "Print the pass again",

  cleared: "Manifest printed. See you at the harbour.",
  clearedNote:
    "Your pass has downloaded. Post it in the Discord or on LinkedIn to find a team.",
  downloadAgain: "Download the pass again",
  amend: "Amend the declaration",

  pass: {
    label: "Boarding pass",
    issuer: "HarbourHack",
    port: "Port of Sydney",
    stamp: "Cleared for boarding",
    manifestLabel: "Manifest no.",
    passengerLabel: "Passenger",
    originLabel: "Port of origin",
    cargoLabel: "Cargo",
    bannerLabel: "Status",
    banner: "Cleared",
    footnote: "Non-transferable. Present at the dock.",
  },
} as const;
