
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
    title: "Indivity Integration Platform",
    description: "Co-founded solution that integrates data about people across software platforms, enabling better decision-making and workflow automation for growth-focused companies.",
    imageUrl: "/lovable-uploads/image-5",
    technologies: ["Data Integration", "API Development", "MarTech"],
    liveUrl: "https://indivity.io",
    status: "Completed",
    featured: true
  },
  {
    id: "3",
    title: "MantaBond",
    description: "Part of the founding team creating a supergroup of C-level executives to help companies scale effectively through fractional leadership and strategic guidance.",
    technologies: ["Executive Leadership", "Scaling Strategy", "Growth Advisory"],
    liveUrl: "https://mantabond.com",
    status: "Active",
    featured: true
  },
  {
    id: "4",
    title: "Marketing Growth Framework",
    description: "Developing an open-source marketing framework for early-stage startups, based on 20+ years of experience scaling companies from zero to millions in revenue.",
    technologies: ["Growth Marketing", "Framework Development", "Open Source"],
    status: "Planned"
  },
  {
    id: "5",
    title: "Startup Marketing Playbook",
    description: "Comprehensive guide for founders on implementing effective marketing strategies with limited resources. Includes templates, examples, and step-by-step implementation plans.",
    technologies: ["Content Creation", "Marketing Strategy", "Educational Resources"],
    status: "Active"
  },
  {
    id: "6",
    title: "Growth Marketing Certification",
    description: "Developing an online certification program to teach marketers and founders data-driven growth techniques based on real-world case studies and proven methodologies.",
    technologies: ["EdTech", "Marketing Education", "Certification Development"],
    status: "Planned"
  }
];

export const featuredProjects = projects.filter(project => project.featured);
