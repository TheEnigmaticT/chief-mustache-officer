
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
    text: "When I want to trust someone with our GTM, Trevor is the best. We gave him a month to build out our GTM strategy from scratch, and he built a self-sustaining marketing strategy that doubled the number of student projects on Lovable. This is the definition of very good work.",
    author: "Justin Chalker",
    position: "COO",
    company: "Lovable AI"
  },
  {
    id: "2",
    text: "Trevor is a seasoned marketing leader who has served as fractional CMO for a number of startups. His ability to take products to market is only surpassed by his breadth of SaaS and gaming experience. I strongly recommend Trevor for senior marketing roles, he will be an impact player immediately.",
    author: "Wes Cummings",
    position: "Founder",
    company: "Recruiter.com"
  },
  {
    id: "3",
    text: "I've worked with countless marketing professionals in my 25+ year career. Trevor may be the best marketing mind I've ever encountered.",
    author: "Garin Hess",
    position: "Founder & CEO",
    company: "Consensus"
  },
  {
    id: "4",
    text: "Trevor has a meaningful advantage over a lot of marketers: he has experience on both the technical and creative sides. Having that level of empathy for the entire process makes him a more effective, mindful leader and creative.",
    author: "Chris Paul",
    position: "Co-Founder & CEO",
    company: "Literal Humans"
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
    text: "I've been working with Trevor for more than 2 months now, and it was one of the best decisions I've ever made. He helped me discover who my ideal customer is and helped me get clarity on my ICP.",
    author: "Zawwadul Sami",
    position: "Founder",
    company: "IndieAdvisers"
  }
];
