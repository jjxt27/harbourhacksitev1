export type ApplicationField =
  | "name"
  | "email"
  | "idea"
  | "problem"
  | "audience"
  | "reach"
  | "link"
  | "team"
  | "commitment";

export type ApplicationPayload = Record<
  Exclude<ApplicationField, "commitment">,
  string
> & { commitment: boolean };

export const apply = {
  title: "Apply to HarbourHack",
  lede:
    "Tell us what you want to build and, more importantly, how you would get it in front of the people it is for. An idea is enough to start.",
  requiredNote: "Required unless marked optional.",
  deadlineNote: "Applications close",
  estimate: "About 6 minutes",
  workflow: {
    steps: ["Crew", "Cargo"],
    saved: "Your answers save on this device.",
    next: "Continue",
    back: "Back",
    backToProgram: "Back to the program",
  },
  /** Publish only after the program's data handling and contact details are confirmed. */
  dataUseNote: null as string | null,

  fields: {
    name: { label: "Name" },
    email: { label: "Email" },
    idea: {
      label: "What do you want to build?",
      hint: "A few clear sentences. Plain words beat a pitch.",
    },
    problem: {
      label: "What problem are you going after?",
      hint: "What is slow, expensive, frustrating or missing today?",
    },
    audience: {
      label: "Who is it for, specifically?",
      hint: "Name the group. \"Students who tutor on the side\" beats \"students\".",
    },
    reach: {
      label: "How would you get it in front of them?",
      hint: "Where do these people already are? A rough plan is fine — we want to see you have thought past the build.",
    },
    link: {
      label: "Anything we should look at? (Optional)",
      hint: "A prototype, sketch, repository or something you shipped before.",
      placeholder: "https://",
    },
    team: {
      label: "Are you applying solo or with a crew?",
      hint: "Add names if you already have people.",
    },
    commitment: {
      label:
        "I can be in Sydney in person for the full program, its checkpoints and Demo Day.",
    },
  },

  errors: {
    name: "Tell us what to call you.",
    email: "That does not look like an email address.",
    idea: "Give us a clear sense of what you want to build.",
    problem: "Tell us what problem you are going after.",
    audience: "Tell us who it is for. Be specific.",
    reach: "Tell us how you would reach them.",
    link: "That is not a URL we can open. Include https://",
    team: "Tell us whether you are applying solo or with a crew.",
    commitment: "We need you there for the full program and Demo Day.",
    submit: "Something broke on our end. Try again, or email us.",
  },

  submit: { idle: "Send application", pending: "Sending..." },

  success: {
    title: "You are on the manifest.",
    body: [
      "Thanks for putting your idea forward.",
      "We read every application and will send the outcome by email after applications close.",
      "Until then, go and find one person who has the problem you described. Ask them how they handle it today.",
    ],
    nextLabel: "What happens next",
  },
} as const;
