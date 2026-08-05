/**
 * The reply.
 *
 * /apply is the reader's side of the thread, so every label is written as a
 * question someone actually asked out loud, not as a form field name. "Name"
 * becomes "What should we call you?". Keep that voice — the moment a label
 * reads like a database column, the page becomes a form again.
 */

export type ApplicationField =
  | "name"
  | "email"
  | "team"
  | "idea"
  | "problem"
  | "audience"
  | "reach"
  | "link"
  | "commitment";

export const apply = {
  title: "Your reply",
  lede: "Nine questions, one of them optional. Answer them the way you would answer a person.",
  /** Sits in the rail and counts up as questions are answered. */
  progressLabel: "Answered",
  savedNote: "Saved on this device as you type",
  optionalNote: "Optional",

  questions: {
    name: { label: "What should we call you?" },
    email: { label: "Where do we reply?" },
    team: {
      label: "Are you coming on your own, or with people?",
      hint: "Names if you have them. Solo is completely fine.",
    },
    idea: {
      label: "What do you want to build?",
      hint: "Plain words beat a pitch. A few sentences is plenty.",
    },
    problem: {
      label: "What is annoying enough that someone would switch?",
      hint: "The thing that is slow, expensive, manual or missing today.",
    },
    audience: {
      label: "Who is the one person you would give it to first?",
      hint: "Name them if you can. \"My flatmate who tutors on weekends\" is a better answer than \"students\".",
    },
    reach: {
      label: "How would you get it in front of them?",
      hint: "Where are these people already? A rough plan is fine — we want to see you have thought past the build.",
    },
    link: {
      label: "Anything we should look at?",
      hint: "A prototype, a sketch, a repo, something you shipped before.",
      placeholder: "https://",
    },
    commitment: {
      label: "I can be in Sydney in person for the whole programme, including Demo Day.",
    },
  },

  errors: {
    name: "We need something to call you.",
    email: "That address will not reach you.",
    idea: "Tell us what you want to build.",
    problem: "Tell us what is annoying enough to fix.",
    audience: "Tell us who gets it first. Be specific.",
    reach: "Tell us how you would reach them.",
    link: "We cannot open that. Include https://",
    team: "Tell us whether you are solo or with people.",
    commitment: "We need you there in person for the whole programme.",
    submit: "That did not send. Try again, or email us.",
    summary: "Some answers are missing",
  },

  send: { idle: "Send reply", pending: "Sending" },

  sent: {
    title: "Sent.",
    receipt: "Seen by us",
    body: [
      "We read every reply, and we will answer by email once applications close.",
      "In the meantime, go and find the person you named. Ask them how they handle it today. That conversation is the actual work.",
    ],
    back: "Back to the thread",
  },
} as const;
