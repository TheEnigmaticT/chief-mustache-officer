
export interface Testimonial {
  id: string;
  text: string;
  author: string;
  position: string;
  company?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    text: "I learned more in 20 minutes with Trevor than I did in 56 years.",
    author: "Christioher Carter",
    position: "CEO",
    company: "Approyo"
  },
  {
    id: "2",
    text: "Trevor is a F&*#ing genius.",
    author: "Dane Maxwell",
    position: "Founder & CEO",
    company: "ResultsJam"
  },
  {
    id: "3",
    text: "Trevor's disciplined and structured approach to achieving growth is a breath of fresh air. He is a master at breaking down complex topics and making them approachable, and a teremendous performance-driven marketer.",
    author: "Jonathan Greechan",
    position: "CEO",
    company: "Founder Institute"
  },
  {
    id: "4",
    text: "Trevor runs the first marketing agency I've worked with where they give a crap about the results, not just their KPIs.",
    author: "Inbar Yagur",
    position: "CMO",
    company: "GrowthSpace"
  },
  {
    id: "5",
    text: "Trevor Longino is one of those super rare people who possesses a mind-blowing set of qualities that make him a marketing genius with extraordinary business acumen.",
    author: "Ken Johnson",
    position: "CRO",
    company: "Interapt"
  },
  {
    id: "6",
    text: "What's most impressive to me about Trevor is his grasp of the technical and tactical aspects of digital marketing. He thinks like an engineer and implements like an artist.",
    author: "Ana Milicevic",
    position: "Principal & Co-Founder",
    company: "Sparrow Advisers"
  },
  {
    id: "7",
    text: "The best resource for direct and actionable advice on how to grow your startup.",
    author: "Ahmed Jamal",
    position: "Founder",
    company: "Padash"
  }
];
