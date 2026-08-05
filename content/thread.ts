/**
 * The conversation.
 *
 * This is a chat, so write like one: short lines, one thought each, the way a
 * person actually types. If a message needs a comma splice to land, send two
 * messages instead. Nothing here should read like marketing copy — the moment
 * a bubble sounds written rather than typed, the illusion goes.
 *
 * Pacing is authored, not random. `pause` is the beat before the sender starts
 * typing; `typing` overrides the length-derived duration. Both are in ms.
 */

export type ChatMessage = {
  id: string;
  /** Authored, not generated: a real clock would desync server and client. */
  time: string;
  text?: string;
  /** Beat before typing starts. */
  pause?: number;
  /** Typing time. Defaults to something derived from the length of `text`. */
  typing?: number;
  /** `facts` and `cta` render as attachments rather than plain bubbles. */
  kind?: "text" | "facts" | "cta";
  /** For `cta`. */
  card?: { title: string; body: string; label: string; href: string };
  /** Renders the bubble as a link. */
  href?: string;
};

/** Typing time when a message does not set its own. */
export const typingFor = (text: string) => Math.min(1400, 320 + text.length * 13);

const messages: ChatMessage[] = [
  { time: "09:12", id: "hey", text: "Hey.", pause: 700, typing: 500 },
  { time: "09:12", id: "quick", text: "Quick one, then I'll leave you alone." },
  { time: "09:13", id: "nobody", text: "Nobody is going to find the thing you build on their own.", pause: 600 },
  { time: "09:13", id: "sit", text: "You'll make something good and it'll just sit there." },
  { time: "09:14", id: "someone", text: "Someone has to go and put it in front of a person." },
  { time: "09:14", id: "you", text: "That someone is you.", typing: 600 },
  { time: "09:15", id: "about", text: "That's the whole idea behind HarbourHack.", pause: 700 },
  { time: "09:15", id: "what", text: "Go-to-market hackathon. Sydney." },
  { time: "09:15", id: "facts", kind: "facts", pause: 400, typing: 500 },
  { time: "09:16", id: "actually", text: "Here's what you'd actually do 👇", pause: 700 },
  { time: "09:16", id: "pick", text: "Pick one person. A real one, someone you can name." },
  { time: "09:17", id: "build", text: "Build the smallest thing they could use." },
  { time: "09:17", id: "give", text: "Then go and give it to them. In person, in a DM, in a group chat — whatever works." },
  { time: "09:18", id: "watch", text: "Then watch what they do with it, and change it." },
  { time: "09:18", id: "need", text: "You don't need a company, funding, users or a deck.", pause: 700 },
  { time: "09:19", id: "code", text: "You don't even need to code. Half of this is talking to strangers." },
  { time: "09:19", id: "scoring", text: "We're not scoring the demo. We're scoring how far it got.", pause: 700 },
  { time: "09:20", id: "rough", text: "A rough thing ten people came back to beats a beautiful thing nobody opened." },
  { time: "09:20", id: "questions", text: "People have asked most of the obvious questions already", href: "/faq", pause: 600 },
  { time: "09:21", id: "anyway", text: "Anyway — this message reached you.", pause: 900 },
  { time: "09:21", id: "skill", text: "That's the whole skill. Come and learn it properly.", typing: 800 },
  {
    time: "09:21",
    id: "cta",
    kind: "cta",
    pause: 500,
    typing: 600,
    card: {
      title: "Register your interest",
      body: "Tell us what you want to build and who it's for. Takes about six minutes.",
      label: "Open the form",
      href: "/apply",
    },
  },
];

export const chat = {
  sender: "HarbourHack",
  /** Sits under the name in the header when nothing is being typed. */
  status: "online",
  typingStatus: "typing…",
  dayLabel: "Today",
  /** The chat opens this far back so timestamps read as a real span, not one minute. */
  spanMinutes: 9,

  composer: { placeholder: "Write a reply…", action: "Register interest", href: "/apply" },
  skip: "Skip to the end",
  jump: "Jump to latest",
  messages,
} as const;
