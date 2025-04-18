
export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'mentoring' | 'resource';
  imageUrl?: string;
  url?: string;
  status: 'available' | 'coming-soon';
  category: string;
}

export const learningResources: LearningResource[] = [
  {
    id: '1',
    title: 'Marketing Fundamentals',
    description: 'Master the essential marketing concepts every founder needs to know.',
    type: 'course',
    imageUrl: '/img/image-2',
    status: 'available',
    category: 'Marketing Academy',
  },
  {
    id: '2',
    title: '1-on-1 Strategy Session',
    description: 'Book a personalized mentoring session to discuss your specific challenges.',
    type: 'mentoring',
    url: 'https://calendly.com/example',
    status: 'available',
    category: 'Mentoring',
  },
  {
    id: '3',
    title: 'Growth Marketing Playbook',
    description: 'A comprehensive guide to building and executing growth strategies.',
    type: 'resource',
    imageUrl: '/img/image-3',
    status: 'available',
    category: 'Resource Library',
  },
  {
    id: '4',
    title: 'Customer Acquisition Workshop',
    description: 'Learn proven techniques to acquire and retain customers.',
    type: 'course',
    imageUrl: '/img/image-6',
    status: 'coming-soon',
    category: 'Marketing Academy',
  }
];
