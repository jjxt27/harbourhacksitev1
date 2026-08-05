/**
 * The replies.
 *
 * /faq is the inbound side of the thread: things people actually wrote back,
 * and what we said. Questions are phrased the way a person types them, not the
 * way a marketing page phrases them ("do i need to code" not "Technical
 * requirements"). Answers stay short enough to be a message.
 *
 * `unconfirmed` marks an answer we cannot give yet. It renders visibly as TBC
 * rather than being hidden or invented.
 */

export type Exchange = {
  time: string;
  /** What they asked. */
  q: string;
  /** What we said. One entry per message. */
  a: readonly string[];
  unconfirmed?: boolean;
};

/** Annotated, not `as const` — see the note in content/thread.ts. */
const exchanges: readonly Exchange[] = [
  {
    time: "10:02",
    q: "what do i actually need to apply",
    a: [
      "An idea, and a person you think it is for.",
      "That is genuinely it. No company, no funding, no users, no deck.",
    ],
  },
  {
    time: "10:04",
    q: "do i need to code",
    a: [
      "No.",
      "Use whatever gets you to something usable fastest. Non-technical people do well here, because half the work is reaching people rather than building for them.",
    ],
  },
  {
    time: "10:07",
    q: "whats go-to-market actually mean",
    a: [
      "Everything between a working thing and a person using it.",
      "Who it is for, where you find them, what you say, what they do next.",
      "It means the same thing whether or not you are a startup. A club tool has an audience too.",
    ],
  },
  {
    time: "10:11",
    q: "can i come with my friends",
    a: ["Yes. Solo or a team, both fine. Tell us who you are building with."],
  },
  {
    time: "10:14",
    q: "i have an idea but its not original",
    a: [
      "Almost nothing is.",
      "We care whether someone wants it, not whether it has been tried. Plenty of the things you use every day were the fourth attempt at something.",
    ],
  },
  {
    time: "10:18",
    q: "do i have to be in sydney",
    a: [
      "For the programme and Demo Day, yes, in person.",
      "You do not have to study here as long as you can be here for it.",
    ],
  },
  {
    time: "10:21",
    q: "how much does it cost",
    a: ["TBC. We will publish this before applications open."],
    unconfirmed: true,
  },
  {
    time: "10:22",
    q: "do you take equity",
    a: ["TBC. We will publish this before applications open."],
    unconfirmed: true,
  },
  {
    time: "10:26",
    q: "what if nobody uses the thing i make",
    a: [
      "That happens, and it is information.",
      "Show us what you tried, where it stalled, and what you changed. An honest account of a failed launch beats an invented number every time.",
    ],
  },
  {
    time: "10:30",
    q: "what are you actually judging",
    a: [
      "How you reached people. What those people did. How much ground you covered. How well you changed course once you had a signal.",
      "The demo is how you show it. The demo is not the thing being judged.",
    ],
  },
  {
    time: "10:33",
    q: "does it need to look good",
    a: [
      "Only as far as that helps someone use it.",
      "A rough tool ten people came back to beats a beautiful one nobody opened.",
    ],
  },
  {
    time: "10:36",
    q: "what counts as proof",
    a: [
      "Anything a real person did that they did not have to do. Sign-ups, repeat visits, messages, payments, referrals.",
      "Bring the raw numbers however small. Small and true is the point.",
    ],
  },
  {
    time: "10:41",
    q: "what happens after demo day",
    a: ["TBC. We will publish this before applications open."],
    unconfirmed: true,
  },
];

export const faq = {
  title: "The replies",
  lede: "Things people wrote back, and what we told them.",
  closing: {
    text: "That is everything we know so far.",
    action: "Send yours",
  },
  exchanges,
} as const;
