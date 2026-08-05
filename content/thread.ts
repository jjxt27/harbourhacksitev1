/**
 * The homepage thread.
 *
 * The conceit: this page is a message HarbourHack sent, and the reader is the
 * person it reached. That is why the copy is second person and why the last
 * group closes the loop — by the time you read it, the thing it describes has
 * already happened to you.
 *
 * Keep messages at the length of something a person would actually send. If a
 * line needs a comma splice or a second sentence to land, split it into two
 * messages instead. The rhythm is the design.
 */

export type Tone = "lead" | "body" | "aside";

export type Message = {
  text: string;
  /** `lead` is set at display scale. Two per page, at most. */
  tone?: Tone;
  /** Turns the message into a link. Used sparingly — twice on the homepage. */
  href?: string;
};

export type Group = {
  /** Sent-at time. Fictional, but consistent and in sequence. */
  time: string;
  messages: readonly Message[];
  /** Renders the programme facts directly beneath this group. */
  attachment?: "facts";
};

/**
 * Annotated rather than `as const`, so optional fields like `tone` and
 * `attachment` stay on the type for every group instead of being narrowed away
 * on the members that do not use them.
 */
const groups: readonly Group[] = [
  {
    time: "09:14",
    messages: [
      { text: "Nobody is going to find it on their own.", tone: "lead" },
      { text: "You will build something good, and it will sit there." },
      { text: "Someone has to go and put it in front of a person." },
      { text: "That someone is you." },
    ],
  },
  {
    time: "09:16",
    attachment: "facts",
    messages: [
      { text: "HarbourHack is a hackathon about that half of the job." },
      { text: "Not the building. The getting-it-to-someone." },
    ],
  },
  {
    time: "09:19",
    messages: [
      { text: "Here is what you will actually do." },
      { text: "Pick a person. One. A real one, someone you can name." },
      { text: "Build the smallest thing they could use." },
      { text: "Give it to them. In person, in a DM, in a group chat, whatever gets it into their hands." },
      { text: "Then watch what they do with it, and change it." },
    ],
  },
  {
    time: "09:23",
    messages: [
      { text: "You do not need a company." },
      { text: "You do not need funding, users, or a deck." },
      { text: "You do not need to write code. Half of this is talking to strangers." },
      { text: "You need an idea, and the nerve to show it to someone before it is ready." },
    ],
  },
  {
    time: "09:26",
    messages: [
      { text: "We are not scoring the demo." },
      { text: "We are scoring how far it got. Who saw it. What they did. What you changed." },
      { text: "A rough thing ten people came back to beats a beautiful thing nobody opened." },
    ],
  },
  {
    time: "09:29",
    messages: [
      { text: "People usually ask a few things first.", tone: "aside" },
      { text: "Read what they asked", href: "/faq", tone: "aside" },
    ],
  },
  {
    time: "09:31",
    messages: [
      { text: "This message reached you.", tone: "lead" },
      { text: "That is the whole skill. Come and learn it properly." },
    ],
  },
];

export const thread = {
  sender: "HarbourHack",
  /** Label for the running count of messages the reader has marked seen. */
  seenLabel: "Seen",
  groups,
  /** The persistent action. Named as a reply because /apply is the reply. */
  reply: { label: "Reply", href: "/apply" },
} as const;
