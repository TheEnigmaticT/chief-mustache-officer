
export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'mentoring' | 'resource' | 'podcast';
  imageUrl: string;
  url?: string;
  status: 'available' | 'coming-soon' | 'closed';
  category: string;
}

export const learningResources: LearningResource[] = [
  {
    id: '1',
    title: 'Experimentation-led GTM with CXL Marketing',
    description: 'Run Minimum Viable Sprints & ship marketing campaigns that work every time.',
    type: 'course',
    imageUrl: '/img/cxl_course.png',
    url: 'https://cxl.com/institute/online-course/go-to-market-strategy/',
    status: 'available',
    category: 'Marketing Academy',
  },
  {
    id: '2',
    title: 'GTM Mastery Program',
    description: 'The OG course on how to build a GTM strategy that works.',
    type: 'course',
    imageUrl: '/img/ct_course.png',
    url: 'https://crowdtamers.com/gtm-mastery-beta/',
    status: 'closed',
    category: 'Marketing Academy',
  },
  {
    id: '3',
    title: 'Go To Market Bootcamp with Founder Institute',
    description: 'A 3-week bootcamp to help you build a GTM strategy for your startup.',
    type: 'course',
    imageUrl: '/img/fi_bootcamp.png',
    url: 'https://fi.co/insight/three-key-tests-to-run-during-your-first-go-to-market-experiment',
    status: 'closed',
    category: 'Marketing Academy',
  },
  {
    id: '4',
    title: 'The 1 Week Product Launch Process (with Founder Institute)',
    description: 'Launch your new startup or idea in just one week.',
    type: 'resource',
    imageUrl: '/img/fi_1week.png',
    url: 'https://www.youtube.com/watch?v=wDWnNkaw8xM',
    status: 'coming-soon',
    category: 'Resource Library',
  },
  {
    id: '5',
    title: 'The 9 Week Guide to building a Million-Dollar Marketing Engine (with Founder Institute)',
    description: "I've built 100+ Million-Dollar Marketing Engines. Here's how.",
    type: 'resource',
    imageUrl: '/img/fi_9weeks.png',
    status: 'available',
    category: 'Resource Library',
  },
  {
    id: '6',
    title: 'Derisk your product Launch',
    description: 'You win when you risk less.',
    type: 'podcast',
    imageUrl: '/img/derisk.png',
    url: 'https://youtu.be/R4aN-IiPCRw?si=VLeVZEGsbgSDNMnM',
    status: 'available',
    category: 'Resource Library',
  },
  {
    id: '7',
    title: 'Early Stage GTM with Narrate Marketing',
    description: "When it's early days, you have to be thrifty with marketing. Here's how I'd do it.",
    type: 'podcast',
    imageUrl: '/img/early_gtm.png',
    url: 'https://youtu.be/DoBfkARsL-U?si=PCohpAs6qiph202r',
    status: 'available',
    category: 'Resource Library',
  },
  {
    id: '8',
    title: 'Build, Iterate, and Scale',
    description: 'An on-demand webinar on how to build, iterate, and scale your product.',
    type: 'podcast',
    imageUrl: '/img/bis.png',
    url: 'https://youtu.be/ne8mwCwK7fE?si=sizWwC71XP8zbfv9',
    status: 'available',
    category: 'Resource Library',
  },
  {
    id: '9',
    title: 'Revenue Makes the Rocking World Go Round',
    description: 'A workshop on revenue and modeling with Wizly.',
    type: 'podcast',
    imageUrl: '/img/revenue.png',
    url: 'https://youtu.be/ckzDIY1ACZc?si=Z1aNhrh5ZSBwkGQe',
    status: 'available',
    category: 'Resource Library',
  }
];
