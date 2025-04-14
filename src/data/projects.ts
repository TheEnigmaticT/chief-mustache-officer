
export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  technologies?: string[];
  liveUrl?: string;
  repoUrl?: string;
  status: "Active" | "Completed" | "Planned";
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "CrowdTamers Growth Platform",
    description: "A comprehensive marketing platform designed to help startups scale from $0 to $2MM+ ARR through data-driven strategies, content marketing, and growth hacking techniques.",
    imageUrl: "/lovable-uploads/image-4",
    technologies: ["Growth Marketing", "Content Strategy", "Conversion Optimization"],
    liveUrl: "https://crowdtamers.com",
    status: "Active",
    featured: true
  },
  {
    id: "2",
    title: "HeyGail - AI Meeting Assistant",
    description: "An AI-powered meeting assistant that helps teams capture action items, decisions, and key points from meetings, enabling better follow-through and team alignment.",
    technologies: ["AI", "NLP", "Meeting Software", "Productivity"],
    liveUrl: "https://heygail.com",
    status: "Active",
    featured: true
  },
  {
    id: "3",
    title: "Insight by CrowdTamers",
    description: "Data analytics and insights platform for growth marketers, providing actionable marketing intelligence to optimize campaigns and improve ROI.",
    technologies: ["Data Analytics", "Marketing Intelligence", "Dashboard"],
    liveUrl: "https://insight.crowdtamers.com",
    status: "Active",
    featured: true
  },
  {
    id: "4",
    title: "Validate First Book",
    description: "A comprehensive guide for entrepreneurs on validating business ideas before investing significant resources, based on experience launching over 100 startups.",
    technologies: ["Product Validation", "Startup Methodology", "User Research"],
    liveUrl: "https://crowdtamers.gumroad.com/l/validate",
    status: "Completed"
  },
  {
    id: "5",
    title: "Modern Open Culture",
    description: "Open source guide on how to run teams effectively in today's distributed work environment, focusing on transparency, autonomy, and results-oriented management.",
    technologies: ["Team Management", "Leadership", "Open Source"],
    repoUrl: "https://github.com/TheEnigmaticT/modern_open_culture",
    status: "Active"
  },
  {
    id: "6",
    title: "Midline - Retro MIDI Game Library",
    description: "A library for creating retro-style video games with MIDI sound integration, combining nostalgic gameplay with modern development practices.",
    technologies: ["Game Development", "MIDI", "JavaScript"],
    repoUrl: "https://github.com/TheEnigmaticT/midline",
    status: "Planned"
  },
  {
    id: "7",
    title: "BeeTrip - AI Expense Reporting",
    description: "Pioneering AI-powered expense reporting solution from 2018 that automatically categorizes and processes business travel expenses.",
    technologies: ["AI", "Expense Management", "Business Travel"],
    repoUrl: "https://github.com/Beetrip/beetrip.github.io",
    status: "Completed"
  }
];

export const featuredProjects = projects.filter(project => project.featured);
