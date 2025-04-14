
export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  description: string;
  achievements?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
}

export interface Skill {
  category: string;
  skills: string[];
}

export interface Publication {
  title: string;
  url?: string;
}

export interface CV {
  name: string;
  title: string;
  summary: string;
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    website: string;
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  publications: Publication[];
  languages: {
    language: string;
    level: string;
  }[];
}

export const cvData: CV = {
  name: "Trevor Longino",
  title: "AI-powered CMO with 20+ years of go-to-market experience",
  summary: "I've built >100 million-dollar marketing engines. I launch startups. 15x from $0 to $2MM+ ARR so far, founder @CrowdTamers. CrowdTamer, leader, and growth content marketing thinker. FI Mentor since 2017; my mission is to help 1,000 founders make >$1MM in annual revenue.",
  contact: {
    email: "trevor.longino@gmail.com",
    phone: "+1.514.649.4103",
    linkedin: "www.linkedin.com/in/trevorlongino",
    website: "chiefmustacheofficer.com"
  },
  experience: [
    {
      id: "1",
      company: "CrowdTamers",
      role: "Founder & CEO",
      period: "November 2007 - Present",
      location: "Worldwide",
      description: "Crowdtamers grows startups from $0 to $2MM+ ARR. As founder & CEO of CrowdTamers, I've taken 12 startups to $2MM+ ARR, each in under 18 months.",
      achievements: [
        "Launched 12 startups in the incubator, with TechCrunch and Slacknews coverage for all of them",
        "Built team from 4 to 27 workers scattered all over the globe",
        "Built 3 startups to #1 in their respective markets"
      ]
    },
    {
      id: "2",
      company: "MantaBond",
      role: "Chief Mustache Officer",
      period: "June 2024 - Present",
      location: "Luxembourg, Luxembourg",
      description: "Part of the cofounding group that is the super group of founders known as MantaBond. Scaling is hard. Get a suite of C-level execs to help."
    },
    {
      id: "3",
      company: "Indivity",
      role: "Co-founder & CEO",
      period: "July 2019 - July 2020",
      location: "Montreal, Canada Area",
      description: "Co-founder of Indivity.io, a solution that integrates data about people across software."
    },
    {
      id: "4",
      company: "Unito - Unite your tools & work better. Together!",
      role: "CMO",
      period: "October 2016 - November 2018",
      location: "Montreal, Canada Area",
      description: "Evangelist, enthusiast, and encourager. Marketing, customer success, & revenue visionary. Chief Mustache Officer.",
      achievements: [
        "First non-tech hire; led business recruiting efforts to grow team to 8 in 10 months",
        "Built and ran CSM team from scratch, achieving CSAT of 95% average over 9 months & NPS 33",
        "Created entire pricing & revenue funnel from scratch, growing to $90,000 MRR in 18 months",
        "Drove business sector of company to help attract & land seed round of $2MM"
      ]
    },
    {
      id: "5",
      company: "Kontakt.io, Inc.",
      role: "Head of Product",
      period: "July 2015 - September 2016",
      location: "Kraków Area, Poland",
      description: "While serving as the Head of Marketing for Kontakt.io's huge growth year of 2015, I was also asked to serve as interim head of product to help solve problems with the team's ability to ship new products.",
      achievements: [
        "Increased key launch velocity over 600%, launching a key product every month in January - June 2016",
        "Built 1 and 2 year product roadmaps and achieved 80% win rate on hitting target release dates",
        "Created cross-functional scrum teams that aligned the whole company"
      ]
    },
    {
      id: "6",
      company: "GOG.com",
      role: "Head of PR & Marketing",
      period: "November 2010 - October 2014",
      location: "Warsaw, Masovian District, Poland",
      description: "I joined GOG.com when in the newly-created head of Marketing & PR role when it was a scrappy startup and I was the 16th employee. When I left, they had over 70 employees, were #1 in the classic gaming market segment with over 75% of the market, and had increased revenues over 1,000% from 2010 to 2014.",
      achievements: [
        "Grew user base from 250,000 to over 4 million in 4 years; MAUs from 1,000 to over 10,000",
        "Front page of Reddit 9 times; front page placement in key trade media at least once a quarter",
        "Successfully repositioned brand from niche classic games distributor to leading independent games distributor"
      ]
    }
  ],
  education: [
    {
      id: "1",
      institution: "University of Central Florida",
      degree: "Bachelor of Arts, Liberal Arts and Sciences/Liberal Studies",
      period: "2000 - 2005"
    }
  ],
  skills: [
    {
      category: "Marketing",
      skills: ["Growth Marketing", "Content Marketing", "PR", "Online Marketing", "Marketing Planning"]
    },
    {
      category: "Leadership",
      skills: ["Team Leadership", "Senior Management", "Delegation", "Defining Requirements"]
    },
    {
      category: "Business",
      skills: ["Product Portfolio Management", "Public Speaking", "Writing"]
    }
  ],
  publications: [
    {
      title: "Where Gaming Is Going -- And Why It Is Wrong"
    },
    {
      title: "Think Big, Build Small"
    },
    {
      title: "Download VS Cloud Gaming"
    },
    {
      title: "Creating a digital business for humans"
    },
    {
      title: "Digital pioneers share their secrets: 3 reasons why selling DRM-free content is the future"
    }
  ],
  languages: [
    { language: "Spanish", level: "Elementary" },
    { language: "Sign Languages", level: "Professional Working" },
    { language: "Polish", level: "Elementary" },
    { language: "French", level: "Limited Working" }
  ]
};
