export type FaqItem = {
  q: string;
  a: string[];
  unconfirmed?: boolean;
};

export type FaqGroup = { title: string; items: readonly FaqItem[] };

export const faq: readonly FaqGroup[] = [
  {
    title: "Before you apply",
    items: [
      {
        q: "What can I apply with?",
        a: [
          "An idea is enough. Tell us what you want to build, who has the problem and how you would get in front of them.",
          "A sketch, prototype or previous project helps us understand you, but none of it is required.",
        ],
      },
      {
        q: "Why is it called HarbourHack?",
        a: [
          "Sydney. That is most of it.",
          "The rest: plenty of hackathons end at the demo, and a demo proves nothing. This one is about what happens after — getting the thing out of the room and into someone's hands.",
        ],
      },
      {
        q: "What does \"go-to-market\" mean here?",
        a: [
          "Everything between a working thing and a person using it. Who it is for, where you find them, what you say, what they do next.",
          "It means the same thing whether or not you are a startup. A club tool or a side project has an audience too, and you still have to go and find them.",
          "You will spend real time on distribution, not just on the product. That is the part most builders skip.",
        ],
      },
      {
        q: "Do I need a company or existing users?",
        a: ["No. You do not need a company, funding, customers, traction or a finished product."],
      },
      {
        q: "Do I need to know how to code?",
        a: [
          "Not necessarily. Use whatever gets you to the smallest usable version fastest.",
          "Non-technical builders do well here, because half the work is reaching people.",
        ],
      },
      {
        q: "Can I apply solo or with a team?",
        a: ["Either. Apply solo, or tell us who you are building with."],
      },
    ],
  },
  {
    title: "The program",
    items: [
      {
        q: "What actually happens during the program?",
        a: [
          "You narrow to one audience, build the smallest version they could use, then go and put it in front of them.",
          "What they do with it becomes the signal you steer on for the rest of the program.",
        ],
      },
      {
        q: "What if I cannot get anyone to use it?",
        a: [
          "That happens, and it is information. Show us what you tried, where it stalled and what you changed.",
          "An honest account of a failed launch beats an invented number every time.",
        ],
      },
      {
        q: "Do I have to be in Sydney?",
        a: [
          "The checkpoints and Demo Day are in person in Sydney.",
          "You do not have to study here, as long as you can be here for the program.",
        ],
      },
      {
        q: "Can I do this around classes or work?",
        a: [
          "Yes, if you can make the fixed sessions and carve out time to build and talk to people between them.",
          "The pace is deliberately fast. Plan for it to take over your week.",
        ],
      },
      { q: "What does it cost?", a: ["TBC."], unconfirmed: true },
      { q: "Do you take equity?", a: ["TBC."], unconfirmed: true },
    ],
  },
  {
    title: "Demo Day",
    items: [
      {
        q: "What are teams judged on?",
        a: [
          "How you reached people, what those people actually did, how much ground you covered and how well you steered once you had a signal.",
          "The demo is how you show it. The demo is not the thing being judged.",
        ],
      },
      {
        q: "Is a polished product an advantage?",
        a: [
          "Only as far as it helps someone use the thing. Beyond that it is decoration.",
          "A rough tool that ten people came back to beats a beautiful one nobody opened.",
        ],
      },
      {
        q: "What counts as evidence?",
        a: [
          "Usage, repeat visits, messages, sign-ups, waitlists, payments, referrals — anything a real person did that they did not have to do.",
          "Bring the raw numbers, however small. Small and true is the point.",
        ],
      },
      { q: "What happens after Demo Day?", a: ["TBC."], unconfirmed: true },
    ],
  },
] as const;
