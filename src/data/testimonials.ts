
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
    text: "Trevor helped us go from $0 to $2MM ARR in just 18 months with his data-driven growth strategies. His marketing expertise transformed our startup trajectory.",
    author: "Sarah Johnson",
    position: "CEO",
    company: "TechFusion"
  },
  {
    id: "2",
    text: "Working with Trevor was transformative for our marketing team. His strategic vision and practical approach to growth helped us refine our positioning and double our lead generation.",
    author: "Michael Chen",
    position: "COO",
    company: "Fluent AI"
  },
  {
    id: "3",
    text: "Trevor's workshops on startup marketing strategies provided our incubator companies with actionable insights that led to immediate results. His ability to simplify complex concepts is remarkable.",
    author: "Emma Rodriguez",
    position: "Director of Startup Programs",
    company: "Innovation Hub"
  },
  {
    id: "4",
    text: "I've attended many marketing seminars, but Trevor's approach to growth is uniquely effective. He combines deep theoretical knowledge with practical, actionable advice that works in the real world.",
    author: "David Patel",
    position: "Founder",
    company: "MetricFlow"
  },
  {
    id: "5",
    text: "Trevor's marketing leadership helped us navigate a challenging pivot and emerge stronger. His strategic insights and hands-on approach were exactly what we needed.",
    author: "Lisa Thompson",
    position: "CEO",
    company: "Orbital Systems"
  },
  {
    id: "6",
    text: "Trevor's ability to identify and articulate our unique value proposition completely transformed our marketing approach. His guidance led to a 300% increase in qualified leads within three months.",
    author: "Alex Kozak",
    position: "VP Marketing",
    company: "DataSync"
  }
];
